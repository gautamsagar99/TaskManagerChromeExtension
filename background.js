// background.js
chrome.runtime.onInstalled.addListener(function () {
  // Initialize the task list
  chrome.storage.sync.set({ tasks: [] }, function () {
    console.log("Task list initialized");
  });
});

chrome.browserAction.onClicked.addListener(function () {
  chrome.windows.create({
    type: "popup",
    width: 400,
    height: 500,
    url: "popup.html",
  });
});
