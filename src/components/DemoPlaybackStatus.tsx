import { useEffect, useMemo, useState } from 'react'
import { useT3kPlayerContext } from 'neural-amp-modeler-wasm'
import {
  formatPlaybackTime,
  getPlaybackPhaseLabel,
  resolveDemoPlaybackStatus,
  type DemoPlaybackSnapshot,
} from '../lib/demoPlayerStatus'
import { NAM_PLAYER_ID } from './NamPlayerSync'

interface DemoPlaybackStatusProps {
  trackName: string
  syncLoading: boolean
  errorMessage?: string | null
  onStatusChange?: (status: DemoPlaybackSnapshot) => void
}

export function DemoPlaybackStatus({
  trackName,
  syncLoading,
  errorMessage = null,
  onStatusChange,
}: DemoPlaybackStatusProps) {
  const { audioState, getAudioNodes } = useT3kPlayerContext()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioEnded, setAudioEnded] = useState(false)

  useEffect(() => {
    const audioElement = getAudioNodes().audioElement
    if (!audioElement) {
      return
    }

    const syncTimes = () => {
      setCurrentTime(audioElement.currentTime)
      setDuration(Number.isFinite(audioElement.duration) ? audioElement.duration : 0)
      setAudioEnded(audioElement.ended)
    }

    syncTimes()

    audioElement.addEventListener('timeupdate', syncTimes)
    audioElement.addEventListener('durationchange', syncTimes)
    audioElement.addEventListener('loadedmetadata', syncTimes)
    audioElement.addEventListener('ended', syncTimes)
    audioElement.addEventListener('pause', syncTimes)
    audioElement.addEventListener('play', syncTimes)

    return () => {
      audioElement.removeEventListener('timeupdate', syncTimes)
      audioElement.removeEventListener('durationchange', syncTimes)
      audioElement.removeEventListener('loadedmetadata', syncTimes)
      audioElement.removeEventListener('ended', syncTimes)
      audioElement.removeEventListener('pause', syncTimes)
      audioElement.removeEventListener('play', syncTimes)
    }
  }, [
    audioState.audioUrl,
    audioState.initState,
    getAudioNodes,
  ])

  const status = useMemo(
    () =>
      resolveDemoPlaybackStatus({
        initState: audioState.initState,
        isPlaying: audioState.isPlaying,
        isActivePlayer: audioState.activePlayerId === NAM_PLAYER_ID,
        syncLoading,
        trackName,
        currentTime,
        duration,
        audioEnded,
        errorMessage,
      }),
    [
      audioEnded,
      audioState.activePlayerId,
      audioState.initState,
      audioState.isPlaying,
      currentTime,
      duration,
      errorMessage,
      syncLoading,
      trackName,
    ],
  )

  useEffect(() => {
    onStatusChange?.(status)
  }, [onStatusChange, status])

  const showProgress =
    status.phase === 'playing' ||
    status.phase === 'paused' ||
    (status.duration > 0 && status.currentTime > 0)

  return (
    <div
      className={`demo-playback-status demo-playback-status--${status.phase}`}
      data-testid="demo-playback-status"
      data-phase={status.phase}
      aria-live="polite"
    >
      <div className="demo-playback-status__header">
        <span
          className={`demo-playback-status__pill demo-playback-status__pill--${status.phase}`}
          data-testid="demo-playback-phase"
        >
          {getPlaybackPhaseLabel(status.phase)}
        </span>
        <p className="demo-playback-status__message">{status.message}</p>
      </div>

      {showProgress && (
        <div className="demo-playback-status__progress">
          <div className="demo-playback-status__track" aria-hidden="true">
            <div
              className="demo-playback-status__fill"
              style={{ width: `${status.progress * 100}%` }}
            />
          </div>
          <div className="demo-playback-status__time" data-testid="demo-playback-time">
            <span>{formatPlaybackTime(status.currentTime)}</span>
            <span>{formatPlaybackTime(status.duration)}</span>
          </div>
        </div>
      )}

      {(status.phase === 'initializing' || status.phase === 'loading') && (
        <p className="demo-playback-status__hint">
          First play can take a few seconds while the amp engine and track load.
        </p>
      )}
    </div>
  )
}
