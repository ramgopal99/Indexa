import { TabsContainer } from './TabsContainer'

export type ViewMode = 'sections' | 'chat'

export class SidebarTabs {
  private tabsContainer: TabsContainer

  constructor(
    onViewModeChange: (mode: ViewMode) => void,
    onToggleExpandAll: () => void
  ) {
    this.tabsContainer = new TabsContainer(onViewModeChange, onToggleExpandAll)
  }

  public getViewMode(): ViewMode {
    return this.tabsContainer.getViewMode()
  }

  public getElement(): HTMLElement | null {
    return this.tabsContainer.getElement()
  }

  public getExpandCollapseBtn(): HTMLElement | null {
    return this.tabsContainer.getExpandCollapseBtn()
  }

  public updateExpandCollapseButton(allExpanded: boolean): void {
    this.tabsContainer.updateExpandCollapseButton(allExpanded)
  }
}
