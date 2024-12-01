const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')

let isDrawing = false
let currentTool = 'brush'
let currentColor = '#000000'
let brushSize = 5
let brushOpacity = 1
let brushHardness = 50
let lineThickness = 2
let textSize = 30
let textOpacity = 1
let gradientAngle = 0
let shadowIntensity = 50
let patternScale = 100
let backgroundColor = '#ffffff'
let canvasOpacity = 1
let rotationAngle = 0
let zoomLevel = 100

let undoStack = []
let redoStack = []

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = backgroundColor
  ctx.globalAlpha = canvasOpacity
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

// Brush tool
function startDrawing(e) {
  isDrawing = true
  ctx.beginPath()
  ctx.moveTo(e.offsetX, e.offsetY)
}

function draw(e) {
  if (!isDrawing) return

  if (currentTool === 'brush') {
    ctx.lineWidth = brushSize
    ctx.strokeStyle = currentColor
    ctx.globalAlpha = brushOpacity
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
  }
  // Add other tool conditions here
}

function stopDrawing() {
  if (!isDrawing) return
  isDrawing = false
  ctx.closePath()
  undoStack.push(canvas.toDataURL())
  redoStack = [] // Clear redo stack after new stroke
}

function changeTool(tool) {
  currentTool = tool
}

function changeColor(e) {
  currentColor = e.target.value
}

function changeBrushSize(e) {
  brushSize = e.target.value
}

function changeBrushOpacity(e) {
  brushOpacity = e.target.value / 100
}

function changeBrushHardness(e) {
  brushHardness = e.target.value
}

function changeLineThickness(e) {
  lineThickness = e.target.value
}

function changeTextSize(e) {
  textSize = e.target.value
}

function changeTextOpacity(e) {
  textOpacity = e.target.value / 100
}

function changeGradientAngle(e) {
  gradientAngle = e.target.value
}

function changeShadowIntensity(e) {
  shadowIntensity = e.target.value
}

function changePatternScale(e) {
  patternScale = e.target.value
}

function changeBackgroundColor(e) {
  backgroundColor = e.target.value
  updateCanvas()
}

function changeCanvasOpacity(e) {
  canvasOpacity = e.target.value / 100
  updateCanvas()
}

function changeRotation(e) {
  rotationAngle = e.target.value
  canvas.style.transform = `rotate(${rotationAngle}deg)`
}

function changeZoom(e) {
  zoomLevel = e.target.value
  canvas.style.transform = `scale(${zoomLevel / 100})`
}

function flipHorizontal() {
  canvas.style.transform = `scaleX(-1)`
}

function flipVertical() {
  canvas.style.transform = `scaleY(-1)`
}

function undoAction() {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop()
    redoStack.push(canvas.toDataURL())
    const img = new Image()
    img.src = lastState
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
}

function redoAction() {
  if (redoStack.length > 0) {
    const lastState = redoStack.pop()
    undoStack.push(canvas.toDataURL())
    const img = new Image()
    img.src = lastState
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  updateCanvas()
}

function saveDrawing() {
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'drawing.png'
  link.click()
}

function addText() {
  const text = prompt('Enter the text to add:')
  if (text) {
    ctx.font = `${textSize}px Arial`
    ctx.fillStyle = currentColor
    ctx.globalAlpha = textOpacity
    ctx.fillText(text, 100, 100)
    undoStack.push(canvas.toDataURL())
  }
}

// Event Listeners for the controls

document.querySelectorAll('.tool-item').forEach(tool => {
  tool.addEventListener('click', () => {
    changeTool(tool.title.toLowerCase().replace(' tool', ''))
  })
})

document.getElementById('customColor').addEventListener('input', changeColor)
document.getElementById('brushSize').addEventListener('input', changeBrushSize)
document
  .getElementById('brushOpacity')
  .addEventListener('input', changeBrushOpacity)
document
  .getElementById('brushHardness')
  .addEventListener('input', changeBrushHardness)
document
  .getElementById('lineThickness')
  .addEventListener('input', changeLineThickness)
document.getElementById('textSize').addEventListener('input', changeTextSize)
document
  .getElementById('textOpacity')
  .addEventListener('input', changeTextOpacity)
document
  .getElementById('gradientAngle')
  .addEventListener('input', changeGradientAngle)
document
  .getElementById('shadowIntensity')
  .addEventListener('input', changeShadowIntensity)
document
  .getElementById('patternScale')
  .addEventListener('input', changePatternScale)
document
  .getElementById('backgroundColor')
  .addEventListener('input', changeBackgroundColor)
document
  .getElementById('canvasOpacity')
  .addEventListener('input', changeCanvasOpacity)
document
  .getElementById('rotationControl')
  .addEventListener('input', changeRotation)
document.getElementById('zoomControl').addEventListener('input', changeZoom)

document
  .querySelector(".tool-item[title='Undo']")
  .addEventListener('click', undoAction)
document
  .querySelector(".tool-item[title='Redo']")
  .addEventListener('click', redoAction)
document
  .querySelector(".tool-item[title='Clear Canvas']")
  .addEventListener('click', clearCanvas)
document
  .querySelector(".tool-item[title='Save Drawing']")
  .addEventListener('click', saveDrawing)
document
  .querySelector(".tool-item[title='Text']")
  .addEventListener('click', addText)

canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mouseout', stopDrawing)

// Initialize the canvas
updateCanvas()
