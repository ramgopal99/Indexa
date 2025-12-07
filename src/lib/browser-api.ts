// Browser API compatibility layer for Chrome and Firefox
declare global {
  interface Window {
    browser?: typeof chrome;
  }
}

// Use browser API if available (Firefox), otherwise use chrome (Chrome)
export const browserAPI = window.browser || chrome;

// Re-export commonly used APIs with compatibility
export const tabs = browserAPI.tabs;
export const runtime = browserAPI.runtime;
export const storage = browserAPI.storage;
export const scripting = browserAPI.scripting;
export const action = browserAPI.action;
