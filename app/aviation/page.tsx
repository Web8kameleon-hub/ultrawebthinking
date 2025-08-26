import AviationWeather from "@/components/AviationWeather";

export default function Page() {
    return (
        <main style={{ padding: 24, display: "grid", gap: 16 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Aviation Weather</h1>
            <AviationWeather />
        </main>
    );
}
