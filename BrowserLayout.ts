import SidebarNavigation from './SidebarNavigation'
import TabManager from './TabManager'
import SearchInterface from './SearchInterface'
import ContextualAI from './ContextualAI'
import Footer from './Footer'

export default function BrowserLayout({ children }) {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <SidebarNavigation />
      </aside>
      <main style={styles.main}>
        <header style={styles.header}>
          <SearchInterface />
        </header>
        <section style={styles.content}>
          <TabManager />
          {children}
        </section>
        <section style={styles.ai}>
          <ContextualAI />
        </section>
        <footer style={styles.footer}>
          <Footer />
        </footer>
      </main>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif',
    backgroundColor: '#fdfdfd',
  },
  sidebar: {
    width: '240px',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    padding: '1rem',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '1rem',
    borderBottom: '1px solid #eee',
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
  },
  ai: {
    padding: '1rem',
    borderTop: '1px solid #eee',
    backgroundColor: '#fafafa',
  },
  footer: {
    padding: '1rem',
    backgroundColor: '#f0f0f0',
    borderTop: '1px solid #ddd',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
}

