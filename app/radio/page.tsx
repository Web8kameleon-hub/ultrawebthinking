import AudioMonitor from "@/components/radio/AudioMonitor"

export default function Page() {
  const base = process.env.NEXT_PUBLIC_RADIO_AUDIO_URL || process.env.RADIO_AUDIO_URL || ""
  const url = base ? `/api/radio/audio?src=${encodeURIComponent(base)}` : ""
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Radio Test (Real)</h1>
      {url ? <AudioMonitor src={url} title="HF Live" /> : <p>Vendos <code>RADIO_AUDIO_URL</code> te .env.local</p>}
    </main>
  )
}
