const feedbackText = document.getElementById('feedbackText');
const feedbackParagraph = document.getElementById('feedbackParagraph');
const videoInfo = document.getElementById('videoInfo');

const loader = document.getElementById('loader');

const downloadUrlBtn = document.getElementById('downloadUrlBtn');
const downloadCurrentTabBtn = document.getElementById('downloadCurrentTabBtn');
const audioOnlySwitch = document.getElementById('audioOnlySwitch');
const audioOnlySwitchLabel = document.getElementById('audioOnlySwitchLabel');
const songUrl = document.getElementById('songUrl')

const form = document.getElementById('urlForm');

const API_URL = 'http://35.189.238.119:5000/api/v1';

let audioOnly = false;

async function getCurrentTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

function isValidUrl(url) {
    return ((url.includes('youtube.com') || url.includes('youtu.be')) && url.includes('?v=') || url.includes('&v=')) || (url.includes('open.spotify.com') && (url.includes('track/')));
}

function getVideoId(input) {
    return input.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/)[1]; 
}

function getPlatform() {

}

async function downloadCurrent() {
    let url;
    let info;
    let platform = 'youtube';

    videoInfo.innerText = ``;

    getCurrentTab().then(async tab => {
        url = tab.url;
        if(!isValidUrl(url)) {
            feedbackText.innerText = "Invalid url";
            feedbackParagraph.innerText = "Make sure the url is a valid YouTube video or Spotify song";

            return;
        }
        if(url.includes('open.spotify.com')) {
            platform = 'spotify';
        }

        form.hidden = true;
        audioOnlySwitch.setAttribute('disabled', null);
        feedbackText.innerText = `Getting ${platform} ` + (platform.includes('spotify') ? "audio" : (audioOnly ? "audio" : "video")) + " info";
        feedbackParagraph.innerText = "Don't close this window until the download is complete";


        //get video info
        try {
            const response = await fetch(`${API_URL}/${platform}/info?url=${url}`);
            info = await response.text();
            info = JSON.parse(info);
            console.log(info);

            //fix invalid file name
            info.title = info.title.replace(/[\\/:"*?<>|]/g, '');
        } catch (err) {
            feedbackText.innerText = (platform.includes('spotify') ? "audio" : (audioOnly ? "audio" : "video")) + " info";
            form.hidden = false;
            console.log(err);
            return;
        }

        // if(info.type == 'playlist') {
        //     await chrome.downloads.download({
        //         url: `${API_URL}/youtube/downloadPlaylist?info=${JSON.stringify(info)}&audio=${audioOnly}`,
        //         filename: info.title + '.zip'
        //     }).then(() => {
        //         videoInfo.innerText = `Done!`;
        //     }).catch((err) => {
        //         videoInfo.innerText = `There was an error downloading the video`;
        //         console.log(err);
        //     });
        // } else {

            await chrome.downloads.download({
                url: `${API_URL}/${platform}/downloadSingle?url=${info.url}&audio=${audioOnly}`,
                filename: info.title + (platform.includes('spotify') ? '.wav' : (audioOnly ? ".wav" : ".mp4"))
            }).then(() => {
                feedbackText.innerText = "";
                feedbackParagraph = "";
                videoInfo.innerText = `Done!`;
                form.hidden = false;
                audioOnlySwitch.removeAttribute('disabled');
            }).catch((err) => {
                videoInfo.innerText = `There was an error downloading the video`;
                feedbackText.innerText = "";
                feedbackParagraph = "";
                form.hidden = false;
                console.log(err);
            });
        // }
        
    }).catch(err => {
        feedbackText.innerText = "error getting url";
        form.hidden = false;
        console.log(err);
    });
    // // let fileHandler;
    // // [fileHandler] = await window.showOpenFilePicker();
    // // console.log(fileHandler);
    // console.log(window.showOpenFilePicker());
}

async function download(url) {
    let info;
    let platform = 'youtube';
    if(!isValidUrl(url)) {
        feedbackText.innerText = "Invalid url";
        return;
    }
    if(url.includes('open.spotify.com')) {
        platform = 'spotify';
    }

    form.hidden = true;
    audioOnlySwitch.setAttribute('disabled', null);
    feedbackText.innerText = `Getting ${platform} ` + (platform.includes('spotify') ? "audio" : (audioOnly ? "audio" : "video")) + " info";
    feedbackParagraph.innerText = "Don't close this window until the download is complete";

    //get video info
    try {
        const response = await fetch(`${API_URL}/${platform}/info?url=${url}`);
        info = await response.text();
        info = JSON.parse(info);
        console.log(info);

        //fix invalid file name
        info.title = info.title.replace(/[\\/:"*?<>|]/g, '');
    } catch (err) {
        feedbackText.innerText = "There was an error getting the " + (platform.includes('spotify') ? "audio" : (audioOnly ? "audio" : "video")) + " info";
        feedbackParagraph.innerText = "";
        form.hidden = false;
        console.log(err);
        return;
    }

    // if(info.type == 'playlist') {
    //     await chrome.downloads.download({
    //         url: `${API_URL}/youtube/downloadPlaylist?info=${JSON.stringify(info)}&audio=${audioOnly}`,
    //         filename: info.title + '.zip'
    //     }).then(() => {
    //         videoInfo.innerText = `Done!`;
    //     }).catch((err) => {
    //         videoInfo.innerText = `There was an error downloading the video`;
    //         console.log(err);
    //     });
    // } else {
        await chrome.downloads.download({
            url: `${API_URL}/${platform}/downloadSingle?url=${info.url}&audio=${audioOnly}`,
            filename: info.title + (platform.includes('spotify') ? '.wav' : (audioOnly ? ".wav" : ".mp4"))
        }).then(() => {
            videoInfo.innerText = `Done!`;
            feedbackText.innerText = "";
            feedbackParagraph.innerText = "";
            form.hidden = false;
            audioOnlySwitch.removeAttribute('disabled');
        }).catch((err) => {
            videoInfo.innerText = `There was an error downloading the video`;
            feedbackParagraph.innerText = "";
            form.hidden = false;
            console.log(err);
        });
    // }
    // // let fileHandler;
    // // [fileHandler] = await window.showOpenFilePicker();
    // // console.log(fileHandler);
    // console.log(window.showOpenFilePicker());
}

    audioOnlySwitch.hidden = true;
    audioOnlySwitchLabel.hidden = true;
    downloadCurrentTabBtn.hidden = true;
    form.hidden = true;
    feedbackText.innerText = "Connecting to server...";
fetch('http://35.189.238.119:5000/').then(res => {
    feedbackText.innerText = "";
    audioOnlySwitch.hidden = false;
    form.hidden = false;
    audioOnlySwitchLabel.hidden = false;
    loader.hidden = true;

    chrome.storage.sync.get('audioOnly', (res) => {
        audioOnly = res.audioOnly;
        if(audioOnlySwitch.hasAttribute('checked') && !res.audioOnly) {
            audioOnlySwitch.removeAttribute('checked');
        } else if(!audioOnlySwitch.hasAttribute('checked') && res.audioOnly) {
            audioOnlySwitch.setAttribute('checked', null);
        }
    });
}).catch(err => {
    feedbackText.innerText = "Error talking to server";
    loader.hidden = true;
    form.hidden = true;
    downloadCurrentTabBtn.hidden = true;
});

downloadCurrentTabBtn.addEventListener('click', downloadCurrent);
audioOnlySwitch.addEventListener('change', () => {
    audioOnly = audioOnlySwitch.checked;
    console.log(audioOnly);
    chrome.storage.sync.set({ audioOnly: audioOnly });
});

songUrl.addEventListener('input', () => {
    if(songUrl.value.includes('spotify')) {
        audioOnlySwitch.hidden = true;
        audioOnlySwitchLabel.hidden = true;
    } else {
        audioOnlySwitch.hidden = false;
        audioOnlySwitchLabel.hidden = false;
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    videoInfo.innerText = ``;
    download(songUrl.value);
});



getCurrentTab().then((tab) => {
    if(isValidUrl(tab.url)) {
        downloadCurrentTabBtn.hidden = false;
    }
});