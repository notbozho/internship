const testText = document.getElementById('test');
const videoInfo = document.getElementById('videoInfo');
const testBtn = document.getElementById('testBtn');
const loader = document.getElementById('loader');
const audioOnlySwitch = document.getElementById('audioOnlySwitch');
const audioOnlySwitchLabel = document.getElementById('audioOnlySwitchLabel');


let audioOnly = false;

testBtn.addEventListener('click', run);
audioOnlySwitch.addEventListener('change', () => {
    audioOnly = audioOnlySwitch.checked;
    chrome.storage.sync.set({ audioOnly: audioOnly });
});

chrome.storage.sync.get('audioOnly', (res) => {
    if(audioOnlySwitch.hasAttribute('checked') && !res.audioOnly) {
        audioOnlySwitch.removeAttribute('checked');
    } else if(!audioOnlySwitch.hasAttribute('checked') && res.audioOnly) {
        audioOnlySwitch.setAttribute('checked', null);
    }
});

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function isUrlYoutube(url) {
    console.log(url.match(/youtube\.com/|/youtu\.be/));
    return url.match(/youtube\.com/|/youtu\.be/);
}

function getVideoId(input) {
    return input.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/)[1]; 
}

async function run() {
    testBtn.remove();
    audioOnlySwitch.setAttribute('disabled', null);
    let url;
    getCurrentTab().then(tab => {
        url = tab.url;
        const videoId = getVideoId(url);
        testText.innerText = "Downloading " + (audioOnly ? "audio..." :"video...");
        chrome.downloads.download({
            url: `http://localhost:5000/downloadYoutube?id=${videoId}&audio=${audioOnly}`,
            filename: `${videoId}.mp3`
        }).then(() => {
            videoInfo.innerText = `Done!`;
        });
    }).catch(err => {
        testText.innerText = "error getting url";
        console.log(err);
    });
    // // let fileHandler;
    // // [fileHandler] = await window.showOpenFilePicker();
    // // console.log(fileHandler);
    // console.log(window.showOpenFilePicker());
}

    audioOnlySwitch.hidden = true;
    audioOnlySwitchLabel.hidden = true;
    testBtn.hidden = true;
    testText.innerText = "Connecting to server...";
fetch('http://localhost:5000/').then(res => {
    testText.innerText = "";
    audioOnlySwitch.hidden = false;
    audioOnlySwitchLabel.hidden = false;
    testBtn.hidden = false;
    loader.remove();
}).catch(err => {
    testText.innerText = "Error talking to server";
    loader.remove();
    audioOnlySwitch.remove();
    audioOnlySwitchLabel.remove();
    testBtn.remove();
});