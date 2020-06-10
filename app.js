const AlphaFB = require('@alpha-manager/fb')
const alpha = require('@alpha-manager/core')
const Vibrant = require('node-vibrant')
require('dotenv').config()
const fb = new AlphaFB().config({
  id: 311738659492506, 
  token: process.env.TOKEN 
})

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(600, 700)
const ctx = canvas.getContext('2d')

new alpha.Task().to(fb).do(async actionObject => {
  console.info(`${new Date()} | fetching image`)
  const img = await loadImage('https://source.unsplash.com/random/600x600')
  console.info(`${new Date()} | finished download`)
  ctx.drawImage(img, 0, 0, 600, 600)
  const palette = await Vibrant.from(canvas.toBuffer()).getPalette()
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 600, 600, 100)
  const keys = Object.keys(palette)
  for(const i in keys) {
    ctx.fillStyle = palette[keys[i]].getHex()
    ctx.fillRect(45+i*60+i*30, 620, 60, 60)
  }
  const fs = require('fs')
  const out = fs.createWriteStream(__dirname + '/test.jpeg')
  out.on('finish', () => {
    console.info(`${new Date()} | posting image`)
    actionObject.type = "post"
    actionObject.message = `Colors extracted: ${Object.keys(palette).map(key => palette[key].getHex()).join(', ')}`
    actionObject.media = __dirname + '/test.jpeg'
    actionObject.done()
    console.info(`${new Date()} | image posted`)
  })
  canvas.createJPEGStream().pipe(out)
}).every(15).minute().start()