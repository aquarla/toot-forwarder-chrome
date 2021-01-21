interface StorageData {
  name: string,
  domain: string,
  access_token: string
}

window.onload = () => {
  ['name', 'domain', 'access_token'].forEach(item => {
    chrome.storage.local.get(item, (value) => {
      const element : HTMLInputElement = <HTMLInputElement>document.getElementById(item)
      if (value[item]) {
        element.value = value[item]
      }
    })
  });
  
  document.getElementById('save').onclick = () => {
    const values : StorageData = {
      name: (<HTMLInputElement>document.getElementById('name')).value,
      domain: (<HTMLInputElement>document.getElementById('domain')).value,
      access_token: (<HTMLInputElement>document.getElementById('access_token')).value
    }
    chrome.storage.local.set(values, () => {
      alert('データを保存しました');
    });
  }
}