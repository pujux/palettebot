const AlphaFB = require('@alpha-manager/fb'),
	alpha = require('@alpha-manager/core'),
	Vibrant = require('node-vibrant'),
	fs = require('fs'),
	path = require('path')

const result = require('dotenv').config()
result.error && console.error(result.error)

const fb = new AlphaFB().config({
	id: 311738659492506,
	token: process.env.TOKEN
})

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(600, 700)
const ctx = canvas.getContext('2d')

new alpha.Task().to(fb).do(async actionObject => {
	console.log(`${new Date().toISOString()} | starting post`)
	ctx.drawImage(await loadImage('https://source.unsplash.com/random/600x600?sunset,sunrise'), 0, 0, 600, 600)
	const palette = await Vibrant.from(canvas.toBuffer()).getPalette()
	ctx.fillStyle = '#fff'
	ctx.fillRect(0, 600, 600, 100)
	const keys = Object.keys(palette)
	for (const i in keys) {
		ctx.fillStyle = palette[keys[i]].getHex()
		ctx.fillRect(45 + (i * 60) + (i * 30), 620, 60, 60)
	}
	const out = fs.createWriteStream(path.join(__dirname, '/test.jpeg'))
	out.on('finish', () => {
		actionObject.type = 'post'
		actionObject.message = `Colors extracted: ${Object.keys(palette).map(key => palette[key].getHex()).join(', ')}`
		actionObject.media = path.join(__dirname, '/test.jpeg')
		actionObject.done()
		console.log(`${new Date().toISOString()} | posting finished`)
		ctx.clearRect(0, 0, 600, 700)
	})
	canvas.createJPEGStream().pipe(out)
}).every(15).minute().start()
