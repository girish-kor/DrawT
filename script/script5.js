// Variables
const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')
let painting = false
let brushSize = 5
let brushOpacity = 1
let brushColor = '#000000'
let isErasing = false
let lastX = 0
let lastY = 0
let tool = 'brush' // default tool is brush
let canvasWidth = 1200
let canvasHeight = 800
let undoStack = []
let redoStack = []

// Canvas Size Adjustments
canvas.width = canvasWidth
canvas.height = canvasHeight

// Brush Functions
function startPainting(e) {
  painting = true
  ;[lastX, lastY] = [e.offsetX, e.offsetY]
}

function stopPainting() {
  painting = false
  ctx.beginPath()
  saveState() // Save state for undo
}

function draw(e) {
  if (!painting) return

  ctx.lineWidth = brushSize
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = brushOpacity

  if (tool === 'brush') {
    ctx.strokeStyle = brushColor
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
  } else if (tool === 'eraser') {
    ctx.clearRect(
      e.offsetX - brushSize / 2,
      e.offsetY - brushSize / 2,
      brushSize,
      brushSize
    )
  }
  ;[lastX, lastY] = [e.offsetX, e.offsetY]
}

function setBrushColor(color) {
  brushColor = color
}

function setBrushSize(size) {
  brushSize = size
}

function setBrushOpacity(opacity) {
  brushOpacity = opacity / 100
}

function setEraserSize(size) {
  brushSize = size
}

// Tool Handlers
function setTool(newTool) {
  tool = newTool
  isErasing = tool === 'eraser'
}

// Canvas Controls
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  saveState() // Save the cleared canvas state
}

function saveState() {
  undoStack.push(canvas.toDataURL())
  if (undoStack.length > 20) {
    undoStack.shift() // limit stack size
  }
}

function undo() {
  if (undoStack.length > 0) {
    redoStack.push(canvas.toDataURL())
    const previousState = undoStack.pop()
    const img = new Image()
    img.src = previousState
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
}

function redo() {
  if (redoStack.length > 0) {
    const nextState = redoStack.pop()
    const img = new Image()
    img.src = nextState
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
}

// Canvas Resize
function setCanvasSize(size) {
  canvas.width = size
  canvas.height = size * 0.66 // maintaining aspect ratio
  saveState()
}

// Event Listeners for Drawing
canvas.addEventListener('mousedown', startPainting)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopPainting)
canvas.addEventListener('mouseout', stopPainting)

// Event Listeners for Tool Panel
document.getElementById('customColor').addEventListener('input', e => {
  setBrushColor(e.target.value)
})

document.getElementById('brushSize').addEventListener('input', e => {
  setBrushSize(e.target.value)
})

document.getElementById('brushOpacity').addEventListener('input', e => {
  setBrushOpacity(e.target.value)
})

document.getElementById('canvasSize').addEventListener('input', e => {
  setCanvasSize(e.target.value)
})

document.getElementById('clearCanvas').addEventListener('click', () => {
  clearCanvas()
})

document.getElementById('undo').addEventListener('click', () => {
  undo()
})

document.getElementById('redo').addEventListener('click', () => {
  redo()
})

// Tool Buttons
const toolButtons = document.querySelectorAll('.tool-item')
toolButtons.forEach(button => {
  button.addEventListener('click', () => {
    const toolName = button
      .getAttribute('title')
      .toLowerCase()
      .replace(' tool', '')
    setTool(toolName)
  })
})

// Save Drawing
document.getElementById('save').addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = 'drawing.png'
  link.href = canvas.toDataURL()
  link.click()
})

// Flip Horizontal and Vertical
document.getElementById('flipHorizontal').addEventListener('click', () => {
  ctx.scale(-1, 1)
  ctx.drawImage(canvas, -canvas.width, 0)
  saveState()
})

document.getElementById('flipVertical').addEventListener('click', () => {
  ctx.scale(1, -1)
  ctx.drawImage(canvas, 0, -canvas.height)
  saveState()
})

// Zoom Control
document.getElementById('zoomControl').addEventListener('input', e => {
  const zoomValue = e.target.value
  canvas.style.transform = `scale(${zoomValue / 100})`
})

// Rotation Control
document.getElementById('rotationControl').addEventListener('input', e => {
  const rotationValue = e.target.value
  canvas.style.transform = `rotate(${rotationValue}deg)`
})
