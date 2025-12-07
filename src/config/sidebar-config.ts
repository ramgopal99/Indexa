export interface SidebarConfig {
  width: number;
  position: 'left' | 'right';
  animation: 'slide' | 'fade' | 'scale';
  animationDuration: number;
  autoHide: boolean;
  autoHideDelay: number;
  showOnHover: boolean;
  overlayOpacity: number;
  compactMode: boolean;
  showTopicIcons: boolean;
  topicIconStyle: 'emoji' | 'text' | 'none';
  enableKeyboardShortcuts: boolean;
  keyboardShortcuts: {
    toggle: string;
    search: string;
    close: string;
  };
}

export const defaultSidebarConfig: SidebarConfig = {
  width: 300,
  position: 'right',
  animation: 'slide',
  animationDuration: 300,
  autoHide: false,
  autoHideDelay: 5000,
  showOnHover: false,
  overlayOpacity: 0.3,
  compactMode: false,
  showTopicIcons: true,
  topicIconStyle: 'emoji',
  enableKeyboardShortcuts: true,
  keyboardShortcuts: {
    toggle: 'Ctrl+Shift+L',
    search: 'Ctrl+F',
    close: 'Escape'
  }
};

export const getSidebarConfig = (): SidebarConfig => {
  try {
    const stored = localStorage.getItem('sideIndexer_sidebar_config');
    if (stored) {
      return { ...defaultSidebarConfig, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load sidebar config from localStorage:', error);
  }

  return defaultSidebarConfig;
};

export const saveSidebarConfig = (config: Partial<SidebarConfig>): void => {
  try {
    const currentConfig = getSidebarConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('sideIndexer_sidebar_config', JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save sidebar config to localStorage:', error);
  }
};
