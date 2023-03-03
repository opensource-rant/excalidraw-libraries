import { glob } from 'fs-extra-plus'
import crypto from 'crypto-js'
import { JSDOM } from 'jsdom'

const results = []

const libraryItems = await glob('libraries/**/*.excalidrawlib')

const libraryData = await fs.readJSON('libraries.json')

let secret = $.env.SECRET || 'test'

for (const path of libraryItems) {
  if (path == '') continue

  let [_, user, libraryName] = path.split("/")
  const json = fs.readJSON(path)
  const ciphertext = crypto.AES.encrypt(JSON.stringify(json), secret).toString();
  const info = libraryData.find(e => e.source == `${user}/${libraryName}`)
  const filesToBackup = await glob(['*.jpg', '*.png'],`libraries/${user}`)
  await fetch(`https://github.com/${user}/${user}/funding_links?fragment=1`).then(resp => resp.text()).then(text => {
    const dom = new JSDOM(text)
    const anchor = dom.window.document.querySelector('a')

    if (anchor != null) {
      info['sponsorshipLink'] = anchor.getAttribute('href') 
    }
    info['room'] = ciphertext
    results.push({
      "tag": `${new URLSearchParams(info).toString()}`,
      "hostname": `${user}.${libraryName}`,
      "backup": filesToBackup
    })
    
  })


}

fs.writeJSON('data.json', results)
