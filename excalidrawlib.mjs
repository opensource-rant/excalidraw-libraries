import { glob } from 'fs-extra-plus'
import crypto from 'crypto-js'

const results = []

const libraryItems = await glob('libraries/**/*.excalidrawlib')

const libraryData = await fs.readJSON('libraries.json')

let secret = $.env.SECRET

for (const path of libraryItems) {
  if (path == '') continue

  const [_, user, libraryName] = path.split("/")
  const json = fs.readJSON(path)
  const ciphertext = crypto.AES.encrypt(JSON.stringify(json), secret).toString();
  const info = libraryData.find(e => e.source == `${user}/${libraryName}`)

  results.push({
    "tag": `${ciphertext}`,
    "hostname": `${user}.${libraryName}?${new URLSearchParams(info).toString()}`,
    "backup": await glob(['*.jpg', '*.png'],`libraries/${user}`)
  })
}

fs.writeJSON('data.json', results)
