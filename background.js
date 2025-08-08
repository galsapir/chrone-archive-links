// Opens the given URL on archive.today / archive.is
function openOnArchive(targetUrl) {
  if (!targetUrl) return;
  // If we're already on archive.today/.is, don't double-wrap
  try {
    const u = new URL(targetUrl);
    if (u.hostname.includes('archive.today') || u.hostname.includes('archive.is')) {
      chrome.tabs.create({ url: targetUrl });
      return;
    }
  } catch (e) {
    // If it's not a valid URL (shouldn't happen for pageUrl/tab.url), bail out silently
  }
  const archiveUrl = "https://archive.today/" + targetUrl;
  chrome.tabs.create({ url: archiveUrl });
}

// Toolbar button click
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.url) return;
  openOnArchive(tab.url);
});

// Keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "open-on-archive") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) openOnArchive(tab.url);
});

// Context menu (right-click)
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openOnArchive",
    title: "Open on archive.is",
    contexts: ["page", "link", "selection", "image", "video", "audio"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "openOnArchive") return;
  const target = info.linkUrl || info.srcUrl || info.pageUrl || (tab ? tab.url : null);
  if (target) openOnArchive(target);
});
