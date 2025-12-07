export class MenuTab {
  private tabElement: HTMLElement | null = null
  private isActive: boolean = true

  constructor(onClick: () => void) {
    this.createTab(onClick)
  }

  private createTab(onClick: () => void): void {
    this.tabElement = document.createElement('button')
    this.tabElement.className = 'sidebar-tab active'
    this.tabElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="14" height="14" fill="currentColor" style="margin-right: 4px; vertical-align: middle;">
        <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"/>
      </svg>
      Menu
    `
    this.tabElement.addEventListener('click', onClick)
  }

  public setActive(active: boolean): void {
    this.isActive = active
    if (this.tabElement) {
      if (active) {
        this.tabElement.classList.add('active')
      } else {
        this.tabElement.classList.remove('active')
      }
    }
  }

  public isTabActive(): boolean {
    return this.isActive
  }

  public getElement(): HTMLElement | null {
    return this.tabElement
  }
}
