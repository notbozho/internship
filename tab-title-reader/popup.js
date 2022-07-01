let tabTitle = document.getElementById('tabTitle');
tabTitle.innerHTML = document.title;

let btnEl = document.querySelector('.get-curr-url-btn');

btnEl.addEventListener('click', (e) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let object = tabs[0];
    let url = object.url;
    console.log(url);
  })
})

async function getCurrentTabTitle() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    const { title } = tab;
    tabTitle.innerHTML = title;
    return title;
  }

getCurrentTabTitle();