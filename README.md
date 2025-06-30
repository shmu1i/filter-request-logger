# Filter Request Logger

A Chrome extension that helps identify blocked network requests in environments with content filtering (corporate networks, parental controls, etc.).

## Features

- **Real-time monitoring** of all network requests for the active tab
- **Status tracking** for successful, failed, and blocked requests
- **Filter functionality** to search for specific URLs or domains
- **Clean interface** showing request details (method, status, URL, timestamp, type)
- **Automatic cleanup** when navigating or closing tabs
- **Error detection** for requests blocked by filters or firewalls

## Use Cases

- Troubleshooting corporate content filters
- Debugging parental control software
- Identifying blocked CDN or API endpoints
- Network security analysis
- Web development in restricted environments

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your toolbar

## Usage

1. Click the extension icon to open the request logger
2. Navigate to any website to start logging requests
3. View successful requests (green), redirects (blue), client errors (red), and server errors (red)
4. Use the filter box to search for specific URLs or domains
5. Click "Clear All" to reset the log for the current tab
6. Click "Refresh" to reload the current request data

## Request Status Codes

- **2xx** (Green): Successful requests
- **3xx** (Blue): Redirects
- **4xx** (Red): Client errors (often blocked by filters)
- **5xx** (Red): Server errors
- **ERROR** (Gray): Network errors or blocked requests

## Permissions

- `webRequest`: Monitor network requests
- `webNavigation`: Detect page navigation
- `activeTab`: Access current tab information
- `storage`: Store request data temporarily
- `<all_urls>`: Monitor requests to all domains

## Privacy

This extension only logs request metadata locally within your browser. No data is sent to external servers or stored permanently. All logs are cleared when tabs are closed or the browser is restarted.
