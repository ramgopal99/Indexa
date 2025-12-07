export class ChatTab {
  private tabElement: HTMLElement | null = null
  private isActive: boolean = false

  constructor(onClick: () => void) {
    this.createTab(onClick)
  }

  private createTab(onClick: () => void): void {
    this.tabElement = document.createElement('button')
    this.tabElement.className = 'sidebar-tab'
    this.tabElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
      </svg>
      Chat
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
