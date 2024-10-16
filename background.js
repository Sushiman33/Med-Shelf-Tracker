chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ completedQuestions: 0, totalQuestions: 0 });
});

function updateProgress(completedQuestions, totalQuestions) {
  chrome.storage.local.set({ completedQuestions, totalQuestions });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'updateProgress') {
    updateProgress(message.completedQuestions, message.totalQuestions);
    sendResponse({ status: 'success' });
  }
});
