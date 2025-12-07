import { Search } from '../search/Search'
import { Settings } from '../settings/Settings'

export class SidebarHeader {
  private header: HTMLElement | null = null
  private search: Search
  private settings: Settings

  constructor(search: Search, settings: Settings, onClose: () => void) {
    this.search = search
    this.settings = settings
    this.createHeader(onClose)
  }

  private createHeader(onClose: () => void): void {
    // Create header with title and icon buttons
    this.header = document.createElement('div')
    this.header.className = 'sidebar-header'

    // Left side: Title
    const headerLeft = document.createElement('div')
    headerLeft.className = 'sidebar-header-left'
    const title = document.createElement('h2')
    title.className = 'sidebar-title'
    title.textContent = 'Slider'
    headerLeft.appendChild(title)

    // Right side: Icon buttons
    const headerRight = document.createElement('div')
    headerRight.className = 'sidebar-header-right'

    // Create search button with icon
    const searchButton = document.createElement('button')
    searchButton.className = 'sidebar-header-button search-button'
    searchButton.title = 'Search'
    searchButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
    `
    searchButton.addEventListener('click', () => {
      this.search.toggle()
    })

    // Create settings button with icon
    const settingsButton = document.createElement('button')
    settingsButton.className = 'sidebar-header-button settings-button'
    settingsButton.title = 'Settings'
    settingsButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `
    settingsButton.addEventListener('click', () => {
      this.settings.toggleSettingsDropdown(settingsButton)
    })

    // Create close button with icon
    const closeButton = document.createElement('button')
    closeButton.className = 'sidebar-header-button close-button'
    closeButton.title = 'Close sidebar'
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      </svg>
    `
    closeButton.addEventListener('click', onClose)

    headerRight.appendChild(searchButton)
    headerRight.appendChild(settingsButton)
    headerRight.appendChild(closeButton)
    this.header.appendChild(headerLeft)
    this.header.appendChild(headerRight)
  }

  public getElement(): HTMLElement | null {
    return this.header
  }
}
