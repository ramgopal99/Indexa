export interface SearchConfig {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
  highlightResults: boolean;
  maxResults: number;
  searchDelay: number;
  showMatchCount: boolean;
  autoFocus: boolean;
  clearOnClose: boolean;
}

export const defaultSearchConfig: SearchConfig = {
  caseSensitive: false,
  wholeWord: false,
  regex: false,
  highlightResults: true,
  maxResults: 50,
  searchDelay: 300,
  showMatchCount: true,
  autoFocus: true,
  clearOnClose: true
};

export const getSearchConfig = (): SearchConfig => {
  try {
    const stored = localStorage.getItem('sideIndexer_search_config');
    if (stored) {
      return { ...defaultSearchConfig, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Failed to load search config from localStorage:', error);
  }

  return defaultSearchConfig;
};

export const saveSearchConfig = (config: Partial<SearchConfig>): void => {
  try {
    const currentConfig = getSearchConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('sideIndexer_search_config', JSON.stringify(newConfig));
  } catch (error) {
    console.warn('Failed to save search config to localStorage:', error);
  }
};
