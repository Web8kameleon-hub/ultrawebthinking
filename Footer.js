export default function Footer() {
  return (
    <footer style={styles.footer}>
      Ultrawebthinking © {new Date().getFullYear()} – Të gjitha të drejtat të rezervuara.
    </footer>
  )
}

const styles = {
  footer: {
    textAlign: 'center',
    padding: '1rem',
    fontSize: '0.85rem',
    color: '#888',
    borderTop: '1px solid #eee',
  },
}
