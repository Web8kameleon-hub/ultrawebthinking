export default function SearchInterface() {
  return (
    <div style={styles.searchBox}>
      <input
        type="text"
        placeholder="Kërko në web, mendime ose module..."
        style={styles.input}
      />
    </div>
  )
}

const styles = {
  searchBox: {
    width: '100%',
    padding: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
}
