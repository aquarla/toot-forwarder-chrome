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

function favouriteAndBoost(info: chrome.contextMenus.OnClickData) {
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
          instance.post(`api/v1/statuses/${statusId.toString()}/favourite`)
          instance.post(`api/v1/statuses/${statusId.toString()}/reblog`)
        }
      }).catch((error) => {
        console.log(error);
      }).finally(() => {})
  })
}

function favourite(info: chrome.contextMenus.OnClickData) {
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
          instance.post(`api/v1/statuses/${statusId.toString()}/favourite`)
        }
      }).catch((error) => {
        console.log(error);
      }).finally(() => {})
  })
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
