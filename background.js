let redirectHistory = [];

chrome.webRequest.onBeforeRedirect.addListener(
        (details) => {
                const redirect = {
                        id: Date.now(), // Unique ID for deletion
                        date: new Date().toLocaleString(),
                        fromUrl: details.url,
                        toUrl: details.redirectUrl,
                        statusCode: details.statusCode,
                        timeStamp: details.timeStamp,
                        responseHeaders: details.responseHeaders
                };

                redirectHistory.push(redirect);
                chrome.storage.local.set({ redirectHistory });
        },
        {
                urls: ["<all_urls>"],
                types: ["main_frame", "sub_frame", "xmlhttprequest"]
        },
        ["extraHeaders", "responseHeaders"]
);

// Listen for clear requests from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "clearAll") {
                redirectHistory = [];
                chrome.storage.local.set({ redirectHistory });
                sendResponse({ success: true });
        } else if (request.action === "deleteRedirect") {
                redirectHistory = redirectHistory.filter(r => r.id !== request.redirectId);
                chrome.storage.local.set({ redirectHistory });
                sendResponse({ success: true });
        }
}); 