import { useCallback, useEffect, useRef, useState } from 'react'
import { getDrumTrackById } from '../data/drumTracks'
import { DrumEngine } from '../lib/audio/drumEngine'
import {
  canTriggerFromMidi,
  startCountdown,
  type CountdownController,
} from '../lib/audio/countdown'
import { SessionRecorder } from '../lib/audio/recorder'
import type { MidiNoteEvent } from '../lib/midi'
import {
  DEFAULT_JAM_SETTINGS,
  type JamSessionPhase,
  type JamSessionSettings,
} from '../types/jamSession'

interface NamAudioTap {
  audioContext: AudioContext
  connectToRecorder: (destination: AudioNode) => () => void
}

interface UseJamSessionResult {
  phase: JamSessionPhase
  countdownRemaining: number | null
  settings: JamSessionSettings
  recordingSeconds: number
  isDrumsPlaying: boolean
  isRecording: boolean
  updateSettings: (patch: Partial<JamSessionSettings>) => void
  armSession: () => void
  disarmSession: () => void
  handleMidiNote: (event: MidiNoteEvent) => void
  stopDrums: () => void
  startRecording: () => void
  stopRecording: (filenameBase: string) => Promise<void>
  registerNamAudioTap: (tap: NamAudioTap | null) => void
}

export function useJamSession(): UseJamSessionResult {
  const [phase, setPhase] = useState<JamSessionPhase>('idle')
  const [countdownRemaining, setCountdownRemaining] = useState<number | null>(
    null,
  )
  const [settings, setSettings] = useState<JamSessionSettings>(DEFAULT_JAM_SETTINGS)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [isDrumsPlaying, setIsDrumsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const drumEngineRef = useRef(new DrumEngine())
  const recorderRef = useRef(new SessionRecorder())
  const countdownRef = useRef<CountdownController | null>(null)
  const namTapRef = useRef<NamAudioTap | null>(null)
  const disconnectNamRef = useRef<(() => void) | null>(null)
  const phaseRef = useRef<JamSessionPhase>('idle')

  phaseRef.current = phase

  const connectRecorderBus = useCallback(async () => {
    const drumEngine = drumEngineRef.current
    const recorder = recorderRef.current
    const context = await drumEngine.init(import.meta.env.BASE_URL)
    const destination = recorder.getDestination(context)
    drumEngine.connectRecordDestination(destination)

    disconnectNamRef.current?.()
    disconnectNamRef.current =
      namTapRef.current?.connectToRecorder(destination) ?? null
  }, [])

  const beginDrums = useCallback(async () => {
    const track = getDrumTrackById(settings.drumTrackId)
    if (!track) {
      return
    }

    drumEngineRef.current.setVolume(settings.drumVolume)
    await connectRecorderBus()
    await drumEngineRef.current.start(track)
    setIsDrumsPlaying(true)
    setPhase('playing')

    if (settings.autoRecord && !recorderRef.current.isRecording()) {
      const context = drumEngineRef.current.getAudioContext()
      if (context) {
        recorderRef.current.start(context, settings.recordingFormat)
        setIsRecording(true)
        setPhase('recording')
      }
    }
  }, [connectRecorderBus, settings])

  const armSession = useCallback(() => {
    countdownRef.current?.cancel()
    setCountdownRemaining(null)
    setPhase('armed')
  }, [])

  const disarmSession = useCallback(() => {
    countdownRef.current?.cancel()
    countdownRef.current = null
    drumEngineRef.current.stop()
    setIsDrumsPlaying(false)
    setCountdownRemaining(null)
    setPhase('idle')
  }, [])

  const stopDrums = useCallback(() => {
    countdownRef.current?.cancel()
    countdownRef.current = null
    drumEngineRef.current.stop()
    setIsDrumsPlaying(false)
    setCountdownRemaining(null)
    setPhase(recorderRef.current.isRecording() ? 'recording' : 'idle')
  }, [])

  const handleMidiNote = useCallback(
    (event: MidiNoteEvent) => {
      if (!canTriggerFromMidi(phaseRef.current, event.velocity)) {
        return
      }

      setPhase('countdown')
      void connectRecorderBus()

      countdownRef.current?.cancel()
      countdownRef.current = startCountdown(
        settings.countdownSeconds,
        (remaining) => {
          setCountdownRemaining(remaining)
          if (remaining > 0) {
            drumEngineRef.current.playClick(remaining)
          }
        },
        () => {
          setCountdownRemaining(null)
          void beginDrums()
        },
      )
    },
    [beginDrums, connectRecorderBus, settings.countdownSeconds],
  )

  const startRecording = useCallback(async () => {
    await connectRecorderBus()
    const context = drumEngineRef.current.getAudioContext()
    if (!context) {
      return
    }

    recorderRef.current.start(context, settings.recordingFormat)
    setIsRecording(true)
    setPhase(drumEngineRef.current.isPlaying() ? 'recording' : 'recording')
  }, [connectRecorderBus, settings.recordingFormat])

  const stopRecording = useCallback(
    async (filenameBase: string) => {
      await recorderRef.current.stop(settings.recordingFormat, filenameBase)
      setIsRecording(false)
      setPhase(drumEngineRef.current.isPlaying() ? 'playing' : 'idle')
    },
    [settings.recordingFormat],
  )

  const registerNamAudioTap = useCallback(
    (tap: NamAudioTap | null) => {
      namTapRef.current = tap
      if (tap) {
        void connectRecorderBus()
      } else {
        disconnectNamRef.current?.()
        disconnectNamRef.current = null
      }
    },
    [connectRecorderBus],
  )

  const updateSettings = useCallback((patch: Partial<JamSessionSettings>) => {
    setSettings((current) => ({ ...current, ...patch }))
    if (typeof patch.drumVolume === 'number') {
      drumEngineRef.current.setVolume(patch.drumVolume)
    }
  }, [])

  useEffect(() => {
    const drumEngine = drumEngineRef.current
    let disconnectNam = disconnectNamRef.current

    const intervalId = window.setInterval(() => {
      if (recorderRef.current.isRecording()) {
        setRecordingSeconds(recorderRef.current.getElapsedSeconds())
      } else {
        setRecordingSeconds(0)
      }
    }, 500)

    return () => {
      window.clearInterval(intervalId)
      countdownRef.current?.cancel()
      drumEngine.stop()
      disconnectNam?.()
    }
  }, [])

  return {
    phase,
    countdownRemaining,
    settings,
    recordingSeconds,
    isDrumsPlaying,
    isRecording,
    updateSettings,
    armSession,
    disarmSession,
    handleMidiNote,
    stopDrums,
    startRecording,
    stopRecording,
    registerNamAudioTap,
  }
}
