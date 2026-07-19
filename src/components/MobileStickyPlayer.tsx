import { useEffect, useState } from 'react'
import { useT3kPlayerContext } from 'neural-amp-modeler-wasm'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { NAM_PLAYER_SHELL_SELECTOR, toggleMainPlayerPlayback } from '../lib/demoPlayerControls'
import {
  formatPlaybackTime,
  getPlaybackPhaseLabel,
  resolveDemoPlaybackStatus,
} from '../lib/demoPlayerStatus'
import { NAM_PLAYER_ID } from './NamPlayerSync'

interface MobileStickyPlayerProps {
  trackName: string
  modelName: string
  syncLoading: boolean
  errorMessage?: string | null
}

export function MobileStickyPlayer({
  trackName,
  modelName,
  syncLoading,
  errorMessage = null,
}: MobileStickyPlayerProps) {
  const isMobile = useMediaQuery('(max-width: 720px)')
  const [playerVisible, setPlayerVisible] = useState(true)
  const showBar = isMobile && !playerVisible

  const { audioState, getAudioNodes } = useT3kPlayerContext()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioEnded, setAudioEnded] = useState(false)

  useEffect(() => {
    if (!isMobile) {
      return
    }

    const element = document.querySelector(NAM_PLAYER_SHELL_SELECTOR)
    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPlayerVisible(entry.isIntersecting)
      },
      { threshold: 0.2 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [isMobile])

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
  }, [audioState.audioUrl, audioState.initState, getAudioNodes])

  const status = resolveDemoPlaybackStatus({
    initState: audioState.initState,
    isPlaying: audioState.isPlaying,
    isActivePlayer: audioState.activePlayerId === NAM_PLAYER_ID,
    syncLoading,
    syncLoadingReason: null,
    trackName,
    currentTime,
    duration,
    audioEnded,
    errorMessage,
  })

  const showProgress =
    status.phase === 'playing' ||
    status.phase === 'paused' ||
    (status.duration > 0 && status.currentTime > 0)

  useEffect(() => {
    document.body.classList.toggle('mobile-sticky-player-active', showBar)

    return () => {
      document.body.classList.remove('mobile-sticky-player-active')
    }
  }, [showBar])

  if (!isMobile) {
    return null
  }

  return (
    <div
      className={`mobile-sticky-player${showBar ? ' mobile-sticky-player--visible' : ''}`}
      data-testid="mobile-sticky-player"
      data-visible={showBar ? 'true' : 'false'}
      aria-hidden={!showBar}
    >
      {showBar && (
        <>
          <div className="mobile-sticky-player__content">
            <button
              type="button"
              className="mobile-sticky-player__play"
              data-testid="mobile-sticky-player-toggle"
              aria-label={status.isPlaying ? 'Pause' : 'Play'}
              onClick={toggleMainPlayerPlayback}
            >
              {status.isPlaying ? (
                <span className="mobile-sticky-player__icon mobile-sticky-player__icon--pause" />
              ) : (
                <span className="mobile-sticky-player__icon mobile-sticky-player__icon--play" />
              )}
            </button>

            <div className="mobile-sticky-player__meta">
              <p
                className="mobile-sticky-player__track"
                data-testid="mobile-sticky-player-track"
              >
                {trackName}
              </p>
              <p className="mobile-sticky-player__amp">{modelName}</p>
            </div>

            <span
              className={`mobile-sticky-player__phase mobile-sticky-player__phase--${status.phase}`}
              data-testid="mobile-sticky-player-phase"
            >
              {getPlaybackPhaseLabel(status.phase)}
            </span>
          </div>

          {showProgress && (
            <div className="mobile-sticky-player__progress" aria-hidden="true">
              <div className="mobile-sticky-player__track-line">
                <div
                  className="mobile-sticky-player__fill"
                  style={{ width: `${status.progress * 100}%` }}
                />
              </div>
              <div className="mobile-sticky-player__time">
                <span>{formatPlaybackTime(status.currentTime)}</span>
                <span>{formatPlaybackTime(status.duration)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
