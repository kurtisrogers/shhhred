import { useCallback, useEffect, useRef, useState } from 'react'
import { WebMidi, type ControlChangeMessageEvent, type NoteMessageEvent } from 'webmidi'
import {
  applyMidiCc,
  isWebMidiSupported,
  type MidiDeviceInfo,
  type MidiNoteEvent,
} from '../lib/midi'
import type { EffectSettings, MidiMapping } from '../types/preset'

interface UseMidiOptions {
  enabled: boolean
  mappings: MidiMapping[]
  onCc: (effects: EffectSettings) => void
  onNote?: (event: MidiNoteEvent) => void
  effects: EffectSettings
}

interface UseMidiResult {
  supported: boolean
  enabled: boolean
  ready: boolean
  error: string | null
  inputs: MidiDeviceInfo[]
  selectedInputId: string | null
  lastNote: MidiNoteEvent | null
  lastCc: { cc: number; value: number } | null
  selectInput: (id: string | null) => void
  enable: () => Promise<void>
}

export function useMidi({
  enabled,
  mappings,
  onCc,
  onNote,
  effects,
}: UseMidiOptions): UseMidiResult {
  const [supported] = useState(isWebMidiSupported)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputs, setInputs] = useState<MidiDeviceInfo[]>([])
  const [selectedInputId, setSelectedInputId] = useState<string | null>(null)
  const [lastNote, setLastNote] = useState<MidiNoteEvent | null>(null)
  const [lastCc, setLastCc] = useState<{ cc: number; value: number } | null>(
    null,
  )

  const effectsRef = useRef(effects)
  effectsRef.current = effects

  const enable = useCallback(async () => {
    if (!supported) {
      setError('Web MIDI is not supported in this browser')
      return
    }

    try {
      await WebMidi.enable({ sysex: false })
      setReady(true)
      setError(null)

      const devices = WebMidi.inputs.map((input) => ({
        id: input.id,
        name: input.name,
        manufacturer: input.manufacturer ?? 'Unknown',
      }))
      setInputs(devices)

      if (devices.length > 0 && !selectedInputId) {
        setSelectedInputId(devices[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable MIDI')
    }
  }, [selectedInputId, supported])

  useEffect(() => {
    if (!enabled || !ready) {
      return
    }

    const input = selectedInputId
      ? WebMidi.getInputById(selectedInputId)
      : WebMidi.inputs[0]

    if (!input) {
      return
    }

    const handleNoteOn = (event: NoteMessageEvent) => {
      const velocity =
        typeof event.rawValue === 'number'
          ? event.rawValue
          : event.note.rawAttack
      const noteEvent: MidiNoteEvent = {
        note: event.note.number,
        velocity,
        channel: event.message.channel,
      }
      setLastNote(noteEvent)
      onNote?.(noteEvent)
    }

    const handleControlChange = (event: ControlChangeMessageEvent) => {
      const cc = event.controller.number
      const value = typeof event.value === 'number' ? event.value : 0
      setLastCc({ cc, value })
      const nextEffects = applyMidiCc(effectsRef.current, mappings, cc, value)
      onCc(nextEffects)
    }

    input.addListener('noteon', handleNoteOn)
    input.addListener('controlchange', handleControlChange)

    return () => {
      input.removeListener('noteon', handleNoteOn)
      input.removeListener('controlchange', handleControlChange)
    }
  }, [enabled, mappings, onCc, onNote, ready, selectedInputId])

  useEffect(() => {
    if (!enabled || ready) {
      return
    }
    void enable()
  }, [enable, enabled, ready])

  return {
    supported,
    enabled,
    ready,
    error,
    inputs,
    selectedInputId,
    lastNote,
    lastCc,
    selectInput: setSelectedInputId,
    enable,
  }
}
