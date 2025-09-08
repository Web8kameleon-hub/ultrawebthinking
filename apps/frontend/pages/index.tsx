import '../styles/base.css'

export default function Home() {
  return (
    <div className="container">
      <h1 className="title">UltraWebThinking ✅</h1>
      <p>Sistema industriale funksionale!</p>
      <button 
        className="button"
        onClick={() => alert('Sistemi punon!')}
      >
        Test Button
      </button>
    </div>
  )
}
