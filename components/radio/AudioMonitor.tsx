"use client"
import { useEffect, useRef, useState } from "react";

export default function AudioMonitor({ title = "HF Live", src }: { title?: string; src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [active, setActive] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let raf = 0
    let ctx: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let srcNode: MediaElementAudioSourceNode | null = null;
    
    (async () => {
      try {
        const el = audioRef.current!
        await el.play().catch(() => {}) // user gesture mund të nevojitet
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        analyser = ctx.createAnalyser()
        analyser.fftSize = 512
        srcNode = ctx.createMediaElementSource(el)
        srcNode.connect(analyser)
        analyser.connect(ctx.destination)
        const data = new Uint8Array(analyser.frequencyBinCount)
        const loop = () => {
          analyser!.getByteTimeDomainData(data)
          let sum = 0; for (let i=0;i<data.length;i++){ const v=(data[i]-128)/128; sum += v*v }
          const rms = Math.sqrt(sum / data.length)
          setActive(rms > 0.02)
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
      } catch (e: any) { setErr(e?.message || "Audio init failed") }
    })()
    return () => { cancelAnimationFrame(raf); try { srcNode?.disconnect(); analyser?.disconnect(); ctx?.close() } catch {} }
  }, [])

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-lg font-medium">{active ? "🎧 Audio: aktive" : "🔇 Pa zë"}</div>
      {err && <div className="text-sm text-red-600 mt-1">{err}</div>}
      <audio ref={audioRef} src={src} controls preload="none" className="mt-2 w-full" />
    </div>
  )
}

