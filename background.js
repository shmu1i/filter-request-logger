let requests = {};
let tabRequests = {};

// Listen for completed requests
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.tabId > 0) {
      if (!tabRequests[details.tabId]) {
        tabRequests[details.tabId] = [];
      }
      
      const requestInfo = {
        url: details.url,
        method: details.method,
        statusCode: details.statusCode,
        timestamp: new Date().toLocaleTimeString(),
        type: details.type
      };
      
      tabRequests[details.tabId].unshift(requestInfo);
      
      // Keep only last 100 requests per tab
      if (tabRequests[details.tabId].length > 100) {
        tabRequests[details.tabId] = tabRequests[details.tabId].slice(0, 100);
      }
      
      // Send update to popup if it's open
      chrome.runtime.sendMessage({
        type: 'requestUpdate',
        tabId: details.tabId,
        request: requestInfo
      }).catch(() => {
        // Popup might not be open, ignore error
      });
    }
  },
  { urls: ["<all_urls>"] }
);

// Listen for failed requests
chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    if (details.tabId > 0) {
      if (!tabRequests[details.tabId]) {
        tabRequests[details.tabId] = [];
      }
      
      const requestInfo = {
        url: details.url,
        method: details.method,
        statusCode: 'ERROR',
        error: details.error,
        timestamp: new Date().toLocaleTimeString(),
        type: details.type
      };
      
      tabRequests[details.tabId].unshift(requestInfo);
      
      // Keep only last 100 requests per tab
      if (tabRequests[details.tabId].length > 100) {
        tabRequests[details.tabId] = tabRequests[details.tabId].slice(0, 100);
      }
      
      // Send update to popup if it's open
      chrome.runtime.sendMessage({
        type: 'requestUpdate',
        tabId: details.tabId,
        request: requestInfo
      }).catch(() => {
        // Popup might not be open, ignore error
      });
    }
  },
  { urls: ["<all_urls>"] }
);

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getRequests') {
    sendResponse({
      requests: tabRequests[request.tabId] || []
    });
  } else if (request.type === 'clearRequests') {
    tabRequests[request.tabId] = [];
    sendResponse({ success: true });
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabRequests[tabId];
});

// Listen for navigation events to clear requests on page reload
chrome.webNavigation.onBeforeNavigate.addListener(
  (details) => {
    if (details.frameId === 0) { // Main frame only
      tabRequests[details.tabId] = [];
    }
  }
);