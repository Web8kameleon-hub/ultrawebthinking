import SidebarNavigation from './SidebarNavigation'
import TabManager from './TabManager'
import SearchInterface from './SearchInterface'
import ContextualAI from './ContextualAI'
import Footer from './Footer'

export default function BrowserLayout() {
  return (
    <div className="browser-container">
      <SidebarNavigation />
      <main className="main-content">
        <SearchInterface />
        <TabManager />
        <ContextualAI />
        <Footer />
      </main>
    </div>
  )
}
