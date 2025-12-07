export interface PopupConfig {
  autoRefresh: boolean;
  refreshInterval: number;
  showCurrentTab: boolean;
  compactMode: boolean;
  theme: 'auto' | 'light' | 'dark';
  maxIndexedItems: number;
  showIndexProgress: boolean;
  enableKeyboardShortcuts: boolean;
  keyboardShortcuts: {
    toggleSidebar: string;
    indexPage: string;
  };
}

export const defaultPopupConfig: PopupConfig = {
  autoRefresh: true,
  refreshInterval: 5000,
  showCurrentTab: true,
  compactMode: false,
  theme: 'auto',
  maxIndexedItems: 20,
  showIndexProgress: true,
  enableKeyboardShortcuts: false,
  keyboardShortcuts: {
    toggleSidebar: 'Ctrl+Shift+S',
    indexPage: 'Ctrl+Shift+I'
  }
};

export const getPopupConfig = (): PopupConfig => {
  try {
    const stored = localStorage.getItem('sideIndexer_popup_config');
    if (stored) {
      return { ...defaultPopupConfig, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load popup config from localStorage:', error);
  }

  return defaultPopupConfig;
};

export const savePopupConfig = (config: Partial<PopupConfig>): void => {
  try {
    const currentConfig = getPopupConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('sideIndexer_popup_config', JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save popup config to localStorage:', error);
  }
};
