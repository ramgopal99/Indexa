// Browser API compatibility layer for Chrome and Firefox
declare global {
  interface Window {
    browser?: typeof chrome;
  }
  const browser: typeof chrome | undefined;
}

// Use browser API if available (Firefox), otherwise use chrome (Chrome)
// In Firefox, `browser` is available globally in extension contexts
// In Chrome, we use `chrome`
// Check both global `browser` and `window.browser` for Firefox compatibility
const getBrowserAPI = () => {
  if (typeof browser !== 'undefined' && browser) {
    return browser;
  }
  if (typeof window !== 'undefined' && window.browser) {
    return window.browser;
  }
  return chrome;
};

export const browserAPI = getBrowserAPI();

// Re-export commonly used APIs with compatibility
export const tabs = browserAPI.tabs;
export const runtime = browserAPI.runtime;
export const storage = browserAPI.storage;
export const scripting = browserAPI.scripting;
export const action = browserAPI.action;
