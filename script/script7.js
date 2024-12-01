// Getting all the required elements from the HTML
const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')

const brushSizeControl = document.getElementById('brushSize')
const brushOpacityControl = document.getElementById('brushOpacity')
const brushHardnessControl = document.getElementById('brushHardness')
const lineThicknessControl = document.getElementById('lineThickness')
const textSizeControl = document.getElementById('textSize')
const textOpacityControl = document.getElementById('textOpacity')
const gradientAngleControl = document.getElementById('gradientAngle')
const backgroundColorControl = document.getElementById('backgroundColor')
const customColorControl = document.getElementById('customColor')
const canvasSizeControl = document.getElementById('canvasSize')
const rotationControl = document.getElementById('rotationControl')
const zoomControl = document.getElementById('zoomControl')

// Tool selectors
let isDrawing = false
let currentTool = 'brush' // default tool
let brushColor = '#000000'
let brushSize = 5
let brushOpacity = 100
let brushHardness = 50
let lineThickness = 2
let textSize = 30
let textOpacity = 100
let gradientAngle = 0
let canvasOpacity = 100
let canvasZoom = 1
let rotationAngle = 0
let backgroundColor = '#ffffff'
let undoStack = []
let redoStack = []
let currentText = ''

// Set up the canvas size and properties
canvas.width = canvasSizeControl.value
canvas.height = 800

// Function to start drawing on the canvas
function startDrawing(event) {
  if (currentTool === 'brush' || currentTool === 'eraser') {
    isDrawing = true
    ctx.beginPath()
    ctx.moveTo(event.offsetX, event.offsetY)
  }
}

// Function to stop drawing
function stopDrawing() {
  if (isDrawing) {
    isDrawing = false
    ctx.closePath()
    saveState()
  }
}

// Function to draw on the canvas based on the current tool
function draw(event) {
  if (!isDrawing) return

  ctx.lineWidth = currentTool === 'line' ? lineThickness : brushSize
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = brushOpacity / 100

  if (currentTool === 'brush') {
    ctx.strokeStyle = brushColor
    ctx.lineTo(event.offsetX, event.offsetY)
    ctx.stroke()
  } else if (currentTool === 'eraser') {
    ctx.clearRect(
      event.offsetX - brushSize / 2,
      event.offsetY - brushSize / 2,
      brushSize,
      brushSize
    )
  }
}

// Change tool based on user selection
const toolItems = document.querySelectorAll('.tool-item')
toolItems.forEach(toolItem => {
  toolItem.addEventListener('click', () => {
    currentTool = toolItem.title.toLowerCase().split(' ')[0] // Update tool to brush, eraser, line, etc.
  })
})

// Brush size control
brushSizeControl.addEventListener('input', () => {
  brushSize = brushSizeControl.value
})

// Brush opacity control
brushOpacityControl.addEventListener('input', () => {
  brushOpacity = brushOpacityControl.value
})

// Brush hardness control
brushHardnessControl.addEventListener('input', () => {
  brushHardness = brushHardnessControl.value
})

// Line thickness control
lineThicknessControl.addEventListener('input', () => {
  lineThickness = lineThicknessControl.value
})

// Text size control
textSizeControl.addEventListener('input', () => {
  textSize = textSizeControl.value
})

// Text opacity control
textOpacityControl.addEventListener('input', () => {
  textOpacity = textOpacityControl.value
})

// Gradient angle control
gradientAngleControl.addEventListener('input', () => {
  gradientAngle = gradientAngleControl.value
})

// Canvas size control
canvasSizeControl.addEventListener('input', () => {
  canvas.width = canvasSizeControl.value
  saveState()
})

// Custom color selector
customColorControl.addEventListener('input', () => {
  brushColor = customColorControl.value
})

// Background color control
backgroundColorControl.addEventListener('input', () => {
  backgroundColor = backgroundColorControl.value
  canvas.style.backgroundColor = backgroundColor
  saveState()
})

// Rotation control
rotationControl.addEventListener('input', () => {
  rotationAngle = rotationControl.value
  canvas.style.transform = `rotate(${rotationAngle}deg)`
})

// Zoom control
zoomControl.addEventListener('input', () => {
  canvasZoom = zoomControl.value / 100
  canvas.style.transform = `scale(${canvasZoom})`
})

// Save the current state of the canvas for undo/redo
function saveState() {
  undoStack.push(canvas.toDataURL())
  redoStack = [] // Clear redo stack on new drawing
}

// Undo functionality
document.querySelector('[title="Undo"]').addEventListener('click', () => {
  if (undoStack.length > 0) {
    redoStack.push(canvas.toDataURL())
    const lastState = undoStack.pop()
    const img = new Image()
    img.src = lastState
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
})

// Redo functionality
document.querySelector('[title="Redo"]').addEventListener('click', () => {
  if (redoStack.length > 0) {
    const lastRedoState = redoStack.pop()
    const img = new Image()
    img.src = lastRedoState
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
})

// Clear canvas functionality
document
  .querySelector('[title="Clear Canvas"]')
  .addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    saveState()
  })

// Save drawing functionality
document
  .querySelector('[title="Save Drawing"]')
  .addEventListener('click', () => {
    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = canvas.toDataURL()
    link.click()
  })

// Event listeners for drawing on canvas
canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mouseout', stopDrawing)
