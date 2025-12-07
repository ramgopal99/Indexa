import { Sidebar } from './components/sidebar/Sidebar'
import { runtime } from './lib/browser-api'

class SideIndexer {
  private sidebar: Sidebar

  constructor() {
    this.sidebar = new Sidebar()
    this.init()
  }

  private init(): void {
    // Wait for the page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.sidebar.initialize()
        this.sidebar.observeChatChanges()
      })
    } else {
      this.sidebar.initialize()
      this.sidebar.observeChatChanges()
    }
  }

  public showSidebar(): void {
    this.sidebar.showSidebar()
  }

  public hideSidebar(): void {
    this.sidebar.hideSidebar()
  }

  public isSidebarVisible(): boolean {
    return this.sidebar.isSidebarVisible()
  }
}

// Create a global instance
const indexer = new SideIndexer()

// Listen for messages from popup
runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'toggleSidebar') {
    if (indexer.isSidebarVisible()) {
      indexer.hideSidebar()
    } else {
      indexer.showSidebar()
    }
    sendResponse({ visible: indexer.isSidebarVisible() })
  } else if (message.action === 'getSidebarState') {
    sendResponse({ visible: indexer.isSidebarVisible() })
  } else if (message.action === 'showSidebar') {
    indexer.showSidebar()
    sendResponse({ visible: true })
  }
  return true // Keep the message channel open for async response
})

// CSS is injected automatically via manifest content_scripts
