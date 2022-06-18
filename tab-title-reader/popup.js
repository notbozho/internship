let tabTitle = document.getElementById('tabTitle');
tabTitle.innerHTML = document.title;

async function getCurrentTabTitle() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    const { title } = tab;
    tabTitle.innerHTML = title;
    return title;
  }

getCurrentTabTitle();