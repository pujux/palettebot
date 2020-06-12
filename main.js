const dropbox = document.getElementById("drop-zone")
const input = document.getElementById('file-input')

const Vibrant = require('node-vibrant')

const dismiss = (e) => {
  e.stopPropagation()
  e.preventDefault()
}
const handleFile = (file) => {

}

input.addEventListener('change', (e) => handleFiles(e.target.files[0]), false)

dropbox.addEventListener("dragenter", dismiss, false)
dropbox.addEventListener("dragover", dismiss, false)
dropbox.addEventListener("drop", (e) => {
  e.stopPropagation()
  e.preventDefault()
  handleFiles(e.dataTransfer.files[0])
}, false)
dropbox.addEventListener('click', (e) => {
  input.click()
}, false)
