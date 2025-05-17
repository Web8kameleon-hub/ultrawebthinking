export default function ContextualAI() {
  return (
    <section style={styles.container}>
      <h3 style={styles.title}>🧠 AI Sugjerues</h3>
      <p style={styles.text}>
        Bazuar në aktivitetin tënd të fundit, mund të eksplorosh konceptet e:
        "AGI strategjik", "Rrjetet decentralizuara", "Identiteti Sovran"...
      </p>
    </section>
  )
}

const styles = {
  container: {
    padding: '1rem',
    backgroundColor: '#f5f5ff',
    borderRadius: '6px',
    marginTop: '1rem',
  },
  title: {
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: 1.6,
  },
}
