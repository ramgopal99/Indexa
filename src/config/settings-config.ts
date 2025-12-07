export interface SettingsConfig {
  theme: 'dark' | 'light' | 'auto';
  animations: boolean;
  autoHide: boolean;
  autoHideDelay: number;
  maxTopics: number;
  highlightDuration: number;
}

export const defaultSettingsConfig: SettingsConfig = {
  theme: 'dark',
  animations: true,
  autoHide: false,
  autoHideDelay: 5000,
  maxTopics: 25,
  highlightDuration: 2000
};

export const getSettingsConfig = (): SettingsConfig => {
  try {
    const stored = localStorage.getItem('sideIndexer_settings_config');
    if (stored) {
      return { ...defaultSettingsConfig, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load settings config from localStorage:', error);
  }

  return defaultSettingsConfig;
};

export const saveSettingsConfig = (config: Partial<SettingsConfig>): void => {
  try {
    const currentConfig = getSettingsConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('sideIndexer_settings_config', JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save settings config to localStorage:', error);
  }
};
