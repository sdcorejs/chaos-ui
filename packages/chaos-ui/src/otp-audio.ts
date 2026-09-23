/** Per-instance synthesized UI audio. Never creates a context before opt-in and a trusted gesture. */
export class OtpAudio {
  private context: AudioContext | undefined;
  private activated = false;

  activate(event: Event, enabled: boolean): void {
    if (!enabled || !event.isTrusted) return;
    this.activated = true;
    if (!this.context && typeof globalThis.AudioContext !== "undefined") {
      try {
        this.context = new AudioContext();
      } catch {
        return;
      }
    }
    if (this.context?.state === "suspended")
      void this.context.resume().catch(() => {});
  }

  tone(enabled: boolean, success: boolean): void {
    if (!enabled || !this.activated || this.context?.state !== "running")
      return;
    const context = this.context;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.setValueAtTime(
      success ? 660 : 380,
      context.currentTime,
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      success ? 990 : 520,
      context.currentTime + 0.12,
    );
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.2);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.22);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }

  close(): void {
    const context = this.context;
    this.context = undefined;
    this.activated = false;
    if (context && context.state !== "closed")
      void context.close().catch(() => {});
  }
}
