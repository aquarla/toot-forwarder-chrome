import axios from 'axios';

interface MastodonStatus {
  id: number
}

interface MastodonSearchResponse {
  status: number
  data: {
    statuses: Array<MastodonStatus>
  }
}

function forwardToot(tootUrl: string, favourite: boolean, reblog: boolean) {
  chrome.storage.local.get(['domain', 'access_token'], (value) => {
    const instance = axios.create({
      baseURL: `https://${value['domain']}/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${value['access_token']}`
      }
    });
    instance.get(`api/v2/search?q=${encodeURI(tootUrl)}&resolve=true`)
      .then((response: MastodonSearchResponse) => {
        const statuses: Array<MastodonStatus> = response.data.statuses;
        if (statuses.length === 1) {
          const statusId = statuses[0].id;
          if (favourite) {
            instance.post(`api/v1/statuses/${statusId.toString()}/favourite`);
          }
          if (reblog) {
            instance.post(`api/v1/statuses/${statusId.toString()}/reblog`);
          }
        }
      }).catch((error) => {
        console.log(error);
      });
  });
}

function loadContextMenus() {
  chrome.contextMenus.removeAll();
  chrome.storage.local.get(['name'], (value) => {
    if (value['name']) {
      const m = [
        {
          'title': '転送先のマストドンサーバーを変更',
          'type': 'normal',
          'contexts': ['page', 'link'],
          'onclick': () => {
            chrome.runtime.openOptionsPage();
          }
        },
        {
          'type' : 'separator',
          'contexts': ['page', 'link']
        },
        {
          'title': `${value['name']}に転送してお気に入り＆ブースト`,
          'type': 'normal',
          'contexts': ['link'],
          'onclick': (info: chrome.contextMenus.OnClickData) => {
            const tootUrl = info.linkUrl;
            forwardToot(tootUrl, true, true);
          }
        },
        {
          'title': `${value['name']}に転送してお気に入り`,
          'type': 'normal',
          'contexts': ['link'],
          'onclick': (info: chrome.contextMenus.OnClickData) => {
            const tootUrl = info.linkUrl;
            forwardToot(tootUrl, true, false);
          }
        },
        {
          'title': `${value['name']}に転送`,
          'type': 'normal',
          'contexts': ['link'],
          'onclick': (info: chrome.contextMenus.OnClickData) => {
            const tootUrl = info.linkUrl;
            forwardToot(tootUrl, false, false);
          }
        },
        {
          'title': `表示中のトゥートを${value['name']}に転送してお気に入り＆ブースト`,
          'type': 'normal',
          'contexts': ['page'],
          'onclick': (info: chrome.contextMenus.OnClickData) => {
            const tootUrl = info.pageUrl;
            forwardToot(tootUrl, true, true);
          }
        },
        {
          'title': `表示中のトゥートを${value['name']}に転送してお気に入り`,
          'type': 'normal',
          'contexts': ['page'],
          'onclick': (info: chrome.contextMenus.OnClickData) => {
            const tootUrl = info.pageUrl;
            forwardToot(tootUrl, true, false);
          }
        },
        {
          'title': `表示中のトゥートを${value['name']}に転送`,
          'type': 'normal',
          'contexts': ['page'],
          'onclick': (info: chrome.contextMenus.OnClickData) => {
            const tootUrl = info.pageUrl;
            forwardToot(tootUrl, false, false);
          }
        }
      ];
      for (const v of m) chrome.contextMenus.create(v);
    } else {
      const m = [
        {
          'title': '転送先のマストドンサーバーを追加',
          'type': 'normal',
          'contexts': ['page', 'link'],
          'onclick': () => {
            chrome.runtime.openOptionsPage();
          }
        }
      ];
      for (const v of m) chrome.contextMenus.create(v);
    }
  });
}
chrome.storage.onChanged.addListener(() => {
  loadContextMenus();
});
loadContextMenus();
