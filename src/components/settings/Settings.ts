import './Settings.css'

export class Settings {
  private settingsDropdown: HTMLElement | null = null
  private currentTheme: 'light' | 'dark' = 'light'
  private sidebarElement: HTMLElement | null = null
  private isDropdownOpen: boolean = false
  private studyModeEnabled: boolean = false
  private onStudyModeChange?: (enabled: boolean) => void

  constructor() {
    this.loadSavedTheme()
    this.loadStudyModeSettings()
  }

  public setSidebarElement(element: HTMLElement): void {
    this.sidebarElement = element
    this.applyTheme()
  }

  public toggleSettingsDropdown(triggerElement?: HTMLElement): void {
    if (!this.settingsDropdown) {
      this.createSettingsDropdown()
    }

    if (this.isDropdownOpen) {
      this.hideSettingsDropdown()
    } else {
      this.showSettingsDropdown(triggerElement)
    }
  }

  private showSettingsDropdown(triggerElement?: HTMLElement): void {
    if (!this.settingsDropdown) return

    this.isDropdownOpen = true
    this.settingsDropdown.classList.add('settings-dropdown-visible')

    // Position the dropdown relative to the trigger element (settings button)
    if (triggerElement) {
      this.positionDropdown(triggerElement)
    }
  }

  private hideSettingsDropdown(): void {
    if (this.settingsDropdown) {
      this.isDropdownOpen = false
      this.settingsDropdown.classList.remove('settings-dropdown-visible')
    }
  }

  private positionDropdown(triggerElement: HTMLElement): void {
    if (!this.settingsDropdown) return

    const rect = triggerElement.getBoundingClientRect()
    const dropdown = this.settingsDropdown.querySelector('.settings-dropdown') as HTMLElement

    if (dropdown) {
      // Position below the trigger element, aligned to the right
      const dropdownWidth = 200 // Fixed width from CSS
      const left = Math.max(10, rect.right - dropdownWidth - 10) // Ensure it doesn't go off-screen
      const top = rect.bottom + 8

      dropdown.style.position = 'fixed'
      dropdown.style.left = `${left}px`
      dropdown.style.top = `${top}px`
      dropdown.style.zIndex = '10000'
    }
  }

  private createSettingsDropdown(): void {
    if (this.settingsDropdown) return

    // Create dropdown container
    const dropdown = document.createElement('div')
    dropdown.className = 'settings-dropdown-container'

    // Create dropdown content
    const dropdownContent = document.createElement('div')
    dropdownContent.className = 'settings-dropdown'
    // Apply theme class
    if (this.currentTheme === 'dark') {
      dropdownContent.classList.add('dark')
    }

    // Create dropdown body with theme toggle
    const body = document.createElement('div')
    body.className = 'settings-dropdown-body'

    // Create theme section
    const themeSection = document.createElement('div')
    themeSection.className = 'settings-section'

    const themeToggle = document.createElement('button')
    themeToggle.className = 'theme-toggle-btn'
    themeToggle.textContent = this.currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'
    themeToggle.classList.toggle('dark-mode', this.currentTheme === 'dark')
    themeToggle.addEventListener('click', () => {
      this.toggleTheme()
    })

    themeSection.appendChild(themeToggle)
    body.appendChild(themeSection)

    // Create study mode section
    const studySection = document.createElement('div')
    studySection.className = 'settings-section'

    const studyToggle = document.createElement('button')
    studyToggle.className = 'study-mode-toggle-btn'
    studyToggle.textContent = this.studyModeEnabled ? '📚 Study Mode: ON' : '📖 Study Mode: OFF'
    studyToggle.classList.toggle('study-mode-active', this.studyModeEnabled)
    studyToggle.addEventListener('click', () => {
      this.toggleStudyMode()
    })

    studySection.appendChild(studyToggle)
    body.appendChild(studySection)

    dropdownContent.appendChild(body)
    dropdown.appendChild(dropdownContent)

    this.settingsDropdown = dropdown
    document.body.appendChild(dropdown)

    // Add click outside listener
    setTimeout(() => {
      document.addEventListener('click', this.handleClickOutside.bind(this))
    }, 0)
  }

  private handleClickOutside(event: MouseEvent): void {
    if (!this.settingsDropdown || !this.isDropdownOpen) return

    const target = event.target as HTMLElement
    const isClickInsideDropdown = this.settingsDropdown.contains(target)

    // Check if the click was on the settings button (don't close if it was)
    const settingsButton = document.querySelector('.settings-button')
    const isClickOnSettingsButton = settingsButton && settingsButton.contains(target)

    if (!isClickInsideDropdown && !isClickOnSettingsButton) {
      this.hideSettingsDropdown()
    }
  }

  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem('side-indexer-theme') as 'light' | 'dark' | null
    this.currentTheme = savedTheme || 'light'
    this.applyTheme()
  }

  private saveTheme(): void {
    localStorage.setItem('side-indexer-theme', this.currentTheme)
  }

  public applyTheme(): void {
    // Apply theme to sidebar element only
    if (this.sidebarElement) {
      if (this.currentTheme === 'dark') {
        this.sidebarElement.classList.add('dark')
      } else {
        this.sidebarElement.classList.remove('dark')
      }
    }
    // Apply theme to settings dropdown if it exists
    if (this.settingsDropdown) {
      const dropdown = this.settingsDropdown.querySelector('.settings-dropdown') as HTMLElement
      if (dropdown) {
        if (this.currentTheme === 'dark') {
          dropdown.classList.add('dark')
        } else {
          dropdown.classList.remove('dark')
        }
      }
    }
  }

  public toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.saveTheme()
    this.applyTheme()
    // Update toggle button if dialog is open
    this.updateThemeToggleUI()
  }

  public getCurrentTheme(): 'light' | 'dark' {
    return this.currentTheme
  }

  private updateThemeToggleUI(): void {
    if (!this.settingsDropdown) return

    const toggleBtn = this.settingsDropdown.querySelector('.theme-toggle-btn') as HTMLButtonElement
    if (toggleBtn) {
      const isDark = this.currentTheme === 'dark'
      toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode'
      toggleBtn.classList.toggle('dark-mode', isDark)
    }
  }

  // Study Mode Methods
  private loadStudyModeSettings(): void {
    const savedStudyMode = localStorage.getItem('side-indexer-study-mode') === 'true'
    this.studyModeEnabled = savedStudyMode
  }

  private saveStudyModeSettings(): void {
    localStorage.setItem('side-indexer-study-mode', this.studyModeEnabled.toString())
  }

  public toggleStudyMode(): void {
    this.studyModeEnabled = !this.studyModeEnabled
    this.saveStudyModeSettings()
    this.updateStudyModeToggleUI()
    this.onStudyModeChange?.(this.studyModeEnabled)
  }

  public setStudyModeChangeCallback(callback: (enabled: boolean) => void): void {
    this.onStudyModeChange = callback
  }

  public isStudyModeEnabled(): boolean {
    return this.studyModeEnabled
  }

  private updateStudyModeToggleUI(): void {
    if (!this.settingsDropdown) return

    const studyToggleBtn = this.settingsDropdown.querySelector('.study-mode-toggle-btn') as HTMLButtonElement
    if (studyToggleBtn) {
      studyToggleBtn.textContent = this.studyModeEnabled ? '📚 Study Mode: ON' : '📖 Study Mode: OFF'
      studyToggleBtn.classList.toggle('study-mode-active', this.studyModeEnabled)
    }
  }

  public destroy(): void {
    if (this.settingsDropdown) {
      document.body.removeChild(this.settingsDropdown)
      this.settingsDropdown = null
    }
    // Remove event listeners
    document.removeEventListener('click', this.handleClickOutside.bind(this))
  }
}
