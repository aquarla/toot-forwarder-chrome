import 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';
import './options.css';

import axios, { AxiosResponse } from 'axios';

interface StorageData {
  name: string,
  domain: string,
  access_token: string
}

interface MastodonApiAppsResponse {
  client_id: string,
  client_secret: string
}

interface MastdodonApiTokenResponse {
  access_token: string
}

window.onload = () => {
  ['name', 'domain'].forEach(item => {
    chrome.storage.local.get(item, (value) => {
      const element: HTMLInputElement = <HTMLInputElement>document.getElementById(item);
      if (value[item]) {
        element.value = value[item];
      }
      element.disabled = false;
    });
  });

  document.getElementById('authorize').onclick = () => {
    const name = (<HTMLInputElement>document.getElementById('name')).value;
    const domain = (<HTMLInputElement>document.getElementById('domain')).value;
    const redirectUri = `https://${chrome.runtime.id}.chromiumapp.org/`;
    const instance = axios.create({
      baseURL: `https://${domain}/`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (name === '' || domain === '') {
      return false;
    }

    instance.post('/api/v1/apps', {
      'client_name': 'トゥートを別サーバに転送',
      'redirect_uris': redirectUri,
      'scopes' : 'read:accounts read:search write:statuses write:favourites'
    }).then((response: AxiosResponse<MastodonApiAppsResponse>) => {
      const clientId = response.data.client_id;
      const clientSecret = response.data.client_secret;
      console.log(response.data);
      chrome.identity.launchWebAuthFlow({
        url: `https://${domain}/oauth/authorize?client_id=${clientId}&scope=read:accounts+read:search+write:statuses+write:favourites&redirect_uri=${encodeURI(redirectUri)}&response_type=code`,
        interactive: true
      }, responseUrl => {
        const url = new URL(responseUrl);
        const code = url.searchParams.get('code');
        instance.post('/oauth/token', {
          'client_id': clientId,
          'client_secret': clientSecret,
          'redirect_uri': encodeURI(redirectUri),
          'grant_type': 'authorization_code',
          'code': code,
          'scope' : 'read:accounts read:search write:statuses write:favourites'
        }).then((response: AxiosResponse<MastdodonApiTokenResponse>) => {
          const accessToken = response.data.access_token;
          if (accessToken) {
            const values: StorageData = {
              name: name,
              domain: domain,
              access_token: accessToken
            };
            chrome.storage.local.set(values, () => {
              alert('サーバ情報を保存しました');
            });
          }
        }).catch(() => {
          alert('サーバ情報の保存に失敗しました。設定内容を確認してください');
        });
      });
    }).catch(() => {
      alert('サーバへの接続に失敗しました。設定内容を確認してください');
    });
  };
};
