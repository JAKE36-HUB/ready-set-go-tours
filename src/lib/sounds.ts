const SOUND_KEY = "rsgt_sound_enabled"

export function soundEnabled(): boolean {
  if (typeof window === "undefined") return true
  return localStorage.getItem(SOUND_KEY) !== "false"
}

export function setSoundEnabled(enabled: boolean) {
  localStorage.setItem(SOUND_KEY, String(enabled))
}

let audioCtx: AudioContext | null = null

export function playChime() {
  if (!soundEnabled()) return
  try {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtor) return
    audioCtx = audioCtx || new AudioCtor()
    if (audioCtx.state === "suspended") audioCtx.resume()
    const now = audioCtx.currentTime
    const notes = [880, 1174.66]
    notes.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator()
      const gain = audioCtx!.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.12 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.5)
      osc.connect(gain).connect(audioCtx!.destination)
      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.55)
    })
  } catch {
    /* audio unavailable */
  }
}
