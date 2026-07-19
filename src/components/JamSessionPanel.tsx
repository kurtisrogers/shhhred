import { DRUM_TRACKS } from '../data/drumTracks'
import {
  COUNTDOWN_MAX_SECONDS,
  COUNTDOWN_MIN_SECONDS,
  RECORDING_FORMATS,
  type JamSessionPhase,
  type JamSessionSettings,
} from '../types/jamSession'

interface JamSessionPanelProps {
  phase: JamSessionPhase
  countdownRemaining: number | null
  settings: JamSessionSettings
  recordingSeconds: number
  isRecording: boolean
  isDrumsPlaying: boolean
  onSettingsChange: (patch: Partial<JamSessionSettings>) => void
  onArm: () => void
  onDisarm: () => void
  onStopDrums: () => void
  onStartRecording: () => void
  onStopRecording: (filename: string) => void
}

export function JamSessionPanel({
  phase,
  countdownRemaining,
  settings,
  recordingSeconds,
  isRecording,
  isDrumsPlaying,
  onSettingsChange,
  onArm,
  onDisarm,
  onStopDrums,
  onStartRecording,
  onStopRecording,
}: JamSessionPanelProps) {
  const phaseLabel = (() => {
    switch (phase) {
      case 'armed':
        return 'Armed — play MIDI to start countdown'
      case 'countdown':
        return `Countdown ${countdownRemaining ?? ''}`
      case 'playing':
        return 'Drums rolling'
      case 'recording':
        return `Recording ${recordingSeconds}s`
      default:
        return 'Standby'
    }
  })()

  return (
    <section className="panel jam-panel" data-testid="jam-panel">
      <header className="panel__header">
        <h2>Jam Session</h2>
        <span
          className={`status-pill ${
            phase === 'armed' || phase === 'countdown' || isDrumsPlaying
              ? 'status-pill--on'
              : ''
          }`}
        >
          {phaseLabel}
        </span>
      </header>

      <p className="panel__hint">
        Arm the session, then hit any note on your MIDI guitar. A countdown gives
        you time to get ready before the drum backing kicks in.
      </p>

      <div className="jam-controls">
        <label className="field">
          <span>Countdown (seconds)</span>
          <input
            type="number"
            data-testid="countdown-seconds"
            min={COUNTDOWN_MIN_SECONDS}
            max={COUNTDOWN_MAX_SECONDS}
            value={settings.countdownSeconds}
            onChange={(event) =>
              onSettingsChange({
                countdownSeconds: Number(event.target.value),
              })
            }
          />
        </label>

        <label className="field">
          <span>Drum Backing</span>
          <select
            data-testid="drum-track-select"
            value={settings.drumTrackId}
            onChange={(event) =>
              onSettingsChange({ drumTrackId: event.target.value })
            }
          >
            {DRUM_TRACKS.map((track) => (
              <option key={track.id} value={track.id}>
                {track.name} ({track.bpm} BPM)
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Drum Volume</span>
          <input
            type="range"
            data-testid="drum-volume"
            min={0}
            max={1}
            step={0.01}
            value={settings.drumVolume}
            onChange={(event) =>
              onSettingsChange({ drumVolume: Number(event.target.value) })
            }
          />
        </label>

        <label className="field">
          <span>Download Format</span>
          <select
            data-testid="recording-format-select"
            value={settings.recordingFormat}
            onChange={(event) =>
              onSettingsChange({
                recordingFormat: event.target.value as JamSessionSettings['recordingFormat'],
              })
            }
          >
            {RECORDING_FORMATS.map((format) => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </select>
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            data-testid="auto-record-toggle"
            checked={settings.autoRecord}
            onChange={(event) =>
              onSettingsChange({ autoRecord: event.target.checked })
            }
          />
          <span>Auto-record when drums start</span>
        </label>
      </div>

      <div className="jam-actions">
        {phase === 'idle' || phase === 'playing' || phase === 'recording' ? (
          <button
            type="button"
            className="btn btn--primary"
            data-testid="arm-session"
            onClick={onArm}
          >
            Arm Session
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--ghost"
            data-testid="disarm-session"
            onClick={onDisarm}
          >
            Cancel
          </button>
        )}

        {isDrumsPlaying && (
          <button
            type="button"
            className="btn btn--ghost"
            data-testid="stop-drums"
            onClick={onStopDrums}
          >
            Stop Drums
          </button>
        )}

        {!isRecording ? (
          <button
            type="button"
            className="btn btn--ghost"
            data-testid="start-recording"
            onClick={onStartRecording}
          >
            Record
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            data-testid="stop-recording"
            onClick={() => onStopRecording('shhhred-jam')}
          >
            Stop & Download
          </button>
        )}
      </div>
    </section>
  )
}
