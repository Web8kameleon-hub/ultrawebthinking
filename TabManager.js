import { useState } from 'react'

export default function TabManager() {
  const [tabs] = useState([
    { id: 1, title: 'Ultrawebthinking', content: 'Mirë se vjen në platformën tonë.' },
    { id: 2, title: 'Web8 AGI', content: 'Këtu nis inteligjenca kolektive.' },
  ])
  const [activeTab, setActiveTab] = useState(1)

  return (
    <div style={styles.container}>
      <div style={styles.tabBar}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.title}
          </div>
        ))}
      </div>
      <div style={styles.content}>
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}

const styles = {
  container: { background: '#fff', borderRadius: '6px', boxShadow: '0 0 8px #eee' },
  tabBar: { display: 'flex', borderBottom: '1px solid #ddd' },
  tab: { padding: '0.75rem 1rem', cursor: 'pointer' },
  activeTab: { fontWeight: 'bold', borderBottom: '2px solid #0070f3' },
  content: { padding: '1rem' },
}

