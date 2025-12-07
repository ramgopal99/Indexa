export interface HeaderConfig {
  title: {
    main: string;
    subtitle: string;
  };
  icons: {
    search: boolean;
    close: boolean;
    settings: boolean;
  };
  branding: {
    showLogo: boolean;
    logoColor: string;
  };
}

export const defaultHeaderConfig: HeaderConfig = {
  title: {
    main: "SIDE",
    subtitle: "INDEXER"
  },
  icons: {
    search: true,
    close: true,
    settings: true
  },
  branding: {
    showLogo: true,
    logoColor: "#10b981"
  }
};

export const getHeaderConfig = (): HeaderConfig => {
  // Try to load from localStorage or use defaults
  try {
    const stored = localStorage.getItem('sideIndexer_header_config');
    if (stored) {
      return { ...defaultHeaderConfig, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load header config from localStorage:', error);
  }

  return defaultHeaderConfig;
};

export const saveHeaderConfig = (config: Partial<HeaderConfig>): void => {
  try {
    const currentConfig = getHeaderConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('sideIndexer_header_config', JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save header config to localStorage:', error);
  }
};
