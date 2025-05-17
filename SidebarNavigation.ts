export default function SidebarNavigation() {
  return (
    <nav style={styles.sidebar}>
      <h2 style={styles.title}>Ultraweb</h2>
      <ul style={styles.list}>
        <li><a href="#">🏠 Faqja</a></li>
        <li><a href="#">🌐 Web8</a></li>
        <li><a href="#">🤖 AGI</a></li>
        <li><a href="#">📁 Të dhëna</a></li>
        <li><a href="#">⚙️ Cilësimet</a></li>
      </ul>
    </nav>
  )
}

const styles = {
  sidebar: {
    padding: '1rem',
    color: '#fff',
  },
  title: {
    fontSize: '1.2rem',
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    lineHeight: '2rem',
  },
}
