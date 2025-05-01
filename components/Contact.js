export default function Contact() {
  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Na Kontakto</h2>
      <p style={styles.text}>
        Ke një ide, propozim apo kërkon bashkëpunim? Na shkruaj dhe ekipi ynë do të të përgjigjet shpejt.
      </p>
      <form style={styles.form}>
        <input type="text" placeholder="Emri yt" style={styles.input} />
        <input type="email" placeholder="Email" style={styles.input} />
        <textarea placeholder="Mesazhi..." rows="4" style={styles.textarea}></textarea>
        <button type="submit" style={styles.button}>Dërgo</button>
      </form>
    </section>
  )
}

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginTop: '2rem',
    boxShadow: '0 0 10px rgba(0,0,0,0.03)',
  },
  title: {
    fontSize: '1.4rem',
    marginBottom: '0.5rem',
  },
  text: {
    marginBottom: '1rem',
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
  },
  button: {
    padding: '0.75rem 1.5rem',
    border: 'none',
    backgroundColor: '#0070f3',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s ease',
  },
}
