import { MenuTab } from './MenuTab'
import { ChatTab } from './ChatTab'
import type { ViewMode } from './SidebarTabs'

export class TabsContainer {
  private tabsSection: HTMLElement | null = null
  private menuTab: MenuTab
  private chatTab: ChatTab
  private expandCollapseBtn: HTMLElement | null = null
  private viewMode: ViewMode = 'sections'
  private onViewModeChange: (mode: ViewMode) => void
  private onToggleExpandAll: () => void

  constructor(
    onViewModeChange: (mode: ViewMode) => void,
    onToggleExpandAll: () => void
  ) {
    this.onViewModeChange = onViewModeChange
    this.onToggleExpandAll = onToggleExpandAll

    // Create individual tab components
    this.menuTab = new MenuTab(() => this.setViewMode('sections'))
    this.chatTab = new ChatTab(() => this.setViewMode('chat'))

    this.createTabsSection()
  }

  private createTabsSection(): void {
    // Create tabs and expand/collapse section
    this.tabsSection = document.createElement('div')
    this.tabsSection.className = 'sidebar-tabs-section'

    // Left side: Tabs
    const tabsContainer = document.createElement('div')
    tabsContainer.className = 'sidebar-tabs'

    // Add tab elements to container
    const menuTabElement = this.menuTab.getElement()
    const chatTabElement = this.chatTab.getElement()

    if (menuTabElement) {
      tabsContainer.appendChild(menuTabElement)
    }
    if (chatTabElement) {
      tabsContainer.appendChild(chatTabElement)
    }

    // Right side: Expand/Collapse All button
    this.expandCollapseBtn = document.createElement('button')
    this.expandCollapseBtn.className = 'sidebar-expand-all-btn'
    this.expandCollapseBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    `
    this.expandCollapseBtn.title = 'Collapse All'
    this.expandCollapseBtn.addEventListener('click', () => {
      this.onToggleExpandAll()
    })

    this.tabsSection.appendChild(tabsContainer)
    this.tabsSection.appendChild(this.expandCollapseBtn)
  }

  private setViewMode(mode: ViewMode): void {
    this.viewMode = mode

    if (mode === 'sections') {
      this.menuTab.setActive(true)
      this.chatTab.setActive(false)
    } else {
      this.menuTab.setActive(false)
      this.chatTab.setActive(true)
    }

    this.onViewModeChange(mode)
  }

  public getViewMode(): ViewMode {
    return this.viewMode
  }

  public getElement(): HTMLElement | null {
    return this.tabsSection
  }

  public getExpandCollapseBtn(): HTMLElement | null {
    return this.expandCollapseBtn
  }

  public updateExpandCollapseButton(allExpanded: boolean): void {
    if (!this.expandCollapseBtn) return

    if (allExpanded) {
      // Items are expanded, so button should show "Collapse All" (up arrow)
      this.expandCollapseBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      `
      this.expandCollapseBtn.title = 'Collapse All'
    } else {
      // Items are collapsed, so button should show "Expand All" (down arrow)
      this.expandCollapseBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      `
      this.expandCollapseBtn.title = 'Expand All'
    }
  }
}
