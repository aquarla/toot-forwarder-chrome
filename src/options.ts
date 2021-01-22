import 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';

import axios from 'axios';

interface StorageData {
  name: string,
  domain: string,
  access_token: string
}

window.onload = () => {
  ['name', 'domain', 'access_token'].forEach(item => {
    chrome.storage.local.get(item, (value) => {
      const element: HTMLInputElement = <HTMLInputElement>document.getElementById(item);
      if (value[item]) {
        element.value = value[item];
        element.disabled = false;
      }
    });
  });

  document.getElementById('save').onclick = () => {
    const values: StorageData = {
      name: (<HTMLInputElement>document.getElementById('name')).value,
      domain: (<HTMLInputElement>document.getElementById('domain')).value,
      access_token: (<HTMLInputElement>document.getElementById('access_token')).value
    };
    chrome.storage.local.set(values, () => {
      alert('データを保存しました');
    });
  };

  document.getElementById('verify-credentials').onclick = () => {
    const domain = (<HTMLInputElement>document.getElementById('domain')).value;
    const access_token = (<HTMLInputElement>document.getElementById('access_token')).value;
    const instance = axios.create({
      baseURL: `https://${domain}/`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      }
    });
    instance.get('api/v1/accounts/verify_credentials')
      .then(() => {
        alert('接続のテストに成功しました');
      }).catch(() => {
        alert('接続のテストに失敗しました。設定内容を確認してください');
      });
  };
};