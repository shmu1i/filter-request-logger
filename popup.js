let currentTabId;
let allRequests = [];

// Get status badge class
function getStatusClass(statusCode) {
  if (statusCode === 'ERROR') return 'status-error';
  if (statusCode >= 200 && statusCode < 300) return 'status-2xx';
  if (statusCode >= 300 && statusCode < 400) return 'status-3xx';
  if (statusCode >= 400 && statusCode < 500) return 'status-4xx';
  if (statusCode >= 500) return 'status-5xx';
  return 'status-error';
}

// Render requests
function renderRequests(requests) {
  const content = document.getElementById('content');
  
  if (requests.length === 0) {
    content.innerHTML = '<div class="empty-state">No requests logged yet. Navigate to a page to see requests.</div>';
    return;
  }
  
  const filterValue = document.getElementById('filterInput').value.toLowerCase();
  const filteredRequests = filterValue 
    ? requests.filter(req => req.url.toLowerCase().includes(filterValue))
    : requests;
  
  if (filteredRequests.length === 0) {
    content.innerHTML = '<div class="empty-state">No requests match your filter.</div>';
    return;
  }
  
  const html = filteredRequests.map(req => `
    <div class="request-item">
      <span class="status-badge ${getStatusClass(req.statusCode)}">
        ${req.statusCode}
      </span>
      <span class="method">${req.method}</span>
      <span class="type">${req.type}</span>
      <span class="url" title="${req.url}"><a href="${req.url}" target="_blank">${req.url}</a></span>
      <span class="timestamp">${req.timestamp}</span>
    </div>
  `).join('');
  
  content.innerHTML = `<div class="request-list">${html}</div>`;
}

// Load requests for current tab
async function loadRequests() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTabId = tab.id;
  
  chrome.runtime.sendMessage(
    { type: 'getRequests', tabId: currentTabId },
    (response) => {
      if (response && response.requests) {
        allRequests = response.requests;
        renderRequests(allRequests);
      }
    }
  );
}

// Clear requests
document.getElementById('clearBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage(
    { type: 'clearRequests', tabId: currentTabId },
    () => {
      allRequests = [];
      renderRequests(allRequests);
    }
  );
});

// Refresh
document.getElementById('refreshBtn').addEventListener('click', () => {
  loadRequests();
});

// Filter
document.getElementById('filterInput').addEventListener('input', () => {
  renderRequests(allRequests);
});

// Listen for real-time updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'requestUpdate' && message.tabId === currentTabId) {
    allRequests.unshift(message.request);
    if (allRequests.length > 100) {
      allRequests = allRequests.slice(0, 100);
    }
    renderRequests(allRequests);
  }
});

// Initial load
loadRequests();
