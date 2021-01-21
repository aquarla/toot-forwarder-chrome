import axios from 'axios'

interface MastodonStatus {
  id: number
}

interface MastodonSearchResponse {
  status: number
  data: {
    statuses: Array<MastodonStatus>
  }
}

function forwardToot(info: chrome.contextMenus.OnClickData, favourite: boolean, reblog: boolean) {
  let tootUrl = info.linkUrl;
  chrome.storage.local.get(['domain', 'access_token'], (value) => {
    const instance = axios.create({
      baseURL: `https://${value['domain']}/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${value['access_token']}`
      }
    })
    instance.get(`api/v2/search?q=${encodeURI(tootUrl)}&resolve=true`)
      .then((response: MastodonSearchResponse) => {
        const statuses: Array<MastodonStatus> = response.data.statuses
        if (statuses.length === 1) {
          const statusId = statuses[0].id
          if (favourite) {
           instance.post(`api/v1/statuses/${statusId.toString()}/favourite`)
          }
          if (reblog) {
            instance.post(`api/v1/statuses/${statusId.toString()}/reblog`)
          }
        }
      }).catch((error) => {
        console.log(error);
      }).finally(() => {})
  })
}

function favouriteAndBoost(info: chrome.contextMenus.OnClickData) {
  forwardToot(info, true, true)
}

function favourite(info: chrome.contextMenus.OnClickData) {
  forwardToot(info, true, false)
}

function forward(info: chrome.contextMenus.OnClickData) {
  forwardToot(info, false, false)
}

function loadContextMenus() {
  chrome.contextMenus.removeAll();
  chrome.storage.local.get(['name'], (value) => {
    if (value['name']) {
      const m = [
        {
          "title": `${value['name']}に転送してお気に入り＆ブースト`,
          "type": "normal",
          "contexts": ["link"],
          "onclick": favouriteAndBoost
        },
        {
          "title": `${value['name']}に転送してお気に入り`,
          "type": "normal",
          "contexts": ["link"],
          "onclick": favourite
        },
        {
          "title": `${value['name']}に転送`,
          "type": "normal",
          "contexts": ["link"],
          "onclick": forward
        }
      ];
      for (let v of m) chrome.contextMenus.create(v);
    }
  });
}
chrome.storage.onChanged.addListener(() => {
  loadContextMenus();
});
loadContextMenus();
