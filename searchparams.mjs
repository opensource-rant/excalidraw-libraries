const json = await fs.readJSON('./data.json')

json.forEach((x) => {
  console.log(new URLSearchParams(x.tag).get('name'))
})
