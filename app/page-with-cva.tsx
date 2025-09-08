import { cva } from 'class-variance-authority'
import { containerVariants, titleVariants, linkVariants } from './components.variants'
import styles from './SimpleHome.module.css'

// Alternative using CVA variants for more complex scenarios
export function HomePageWithCVA() {
  return (
    <div className={containerVariants({ size: 'medium', align: 'center' })}>
      <h1 className={titleVariants({ color: 'green', size: 'large' })}>
        EuroWeb System Working ✅
      </h1>
      <p>Server is responding correctly!</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/test" className={linkVariants({ color: 'blue' })}>
          Test Page
        </a>
        <span style={{ margin: '0 10px', color: '#666' }}>|</span>
        <a href="/api/test" className={linkVariants({ color: 'blue' })}>
          Test API
        </a>
      </div>
    </div>
  )
}

// Main component using CSS modules (cleaner for simple cases)
export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>EuroWeb System Working ✅</h1>
      <p className={styles.description}>Server is responding correctly!</p>
      <div className={styles.linksContainer}>
        <a href="/test" className={styles.link}>
          Test Page
        </a>
        <span className={styles.separator}>|</span>
        <a href="/api/test" className={styles.link}>
          Test API
        </a>
      </div>
    </div>
  )
}
