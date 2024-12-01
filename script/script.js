// Setting up the canvas and context
const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')

// Global Variables
let drawing = false
let brushColor = '#000000'
let brushSize = 5
let brushOpacity = 1
let lineThickness = 2
let canvasWidth = canvas.width
let canvasHeight = canvas.height
let currentTool = 'brush'
let undoStack = []
let redoStack = []
let shapeData = null
let rotationAngle = 0
let zoomLevel = 100

// Event listeners for tool selection
document.querySelectorAll('.tool-item').forEach(item => {
  item.addEventListener('click', e => {
    const tool = e.target.closest('.tool-item').title
    switch (tool) {
      case 'Brush Tool':
        currentTool = 'brush'
        break
      case 'Eraser Tool':
        currentTool = 'eraser'
        break
      case 'Line Tool':
        currentTool = 'line'
        break
      case 'Rectangle Tool':
        currentTool = 'rectangle'
        break
      case 'Circle Tool':
        currentTool = 'circle'
        break
      case 'Polygon Tool':
        currentTool = 'polygon'
        break
      case 'Text Tool':
        currentTool = 'text'
        break
      case 'Clear Canvas':
        clearCanvas()
        break
      case 'Save Drawing':
        saveCanvas()
        break
      case 'Undo':
        undoAction()
        break
      case 'Redo':
        redoAction()
        break
      default:
        break
    }
  })
})

// Brush Size Control
document.getElementById('brushSize').addEventListener('input', e => {
  brushSize = e.target.value
})

// Brush Opacity Control
document.getElementById('brushOpacity').addEventListener('input', e => {
  brushOpacity = e.target.value / 100
})

// Line Thickness Control
document.getElementById('lineThickness').addEventListener('input', e => {
  lineThickness = e.target.value
})

// Canvas Zoom Control
document.getElementById('zoomControl').addEventListener('input', e => {
  zoomLevel = e.target.value
  canvas.width = canvasWidth * (zoomLevel / 100)
  canvas.height = canvasHeight * (zoomLevel / 100)
  ctx.scale(zoomLevel / 100, zoomLevel / 100)
  redraw()
})

// Background Color
document.getElementById('backgroundColor').addEventListener('input', e => {
  const bgColor = e.target.value
  canvas.style.backgroundColor = bgColor
})

// Custom Brush Color
document.getElementById('customColor').addEventListener('input', e => {
  brushColor = e.target.value
})

// Mouse events for drawing and interacting with the canvas
canvas.addEventListener('mousedown', e => {
  drawing = true
  const { offsetX, offsetY } = e
  if (currentTool === 'brush' || currentTool === 'eraser') {
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
  } else if (currentTool === 'line') {
    shapeData = { x: offsetX, y: offsetY }
  }
})

canvas.addEventListener('mousemove', e => {
  if (!drawing) return
  const { offsetX, offsetY } = e
  if (currentTool === 'brush') {
    ctx.lineTo(offsetX, offsetY)
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.globalAlpha = brushOpacity
    ctx.stroke()
  } else if (currentTool === 'eraser') {
    ctx.clearRect(
      offsetX - brushSize / 2,
      offsetY - brushSize / 2,
      brushSize,
      brushSize
    )
  } else if (currentTool === 'line' && shapeData) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.moveTo(shapeData.x, shapeData.y)
    ctx.lineTo(offsetX, offsetY)
    ctx.strokeStyle = brushColor
    ctx.lineWidth = lineThickness
    ctx.stroke()
  }
})

canvas.addEventListener('mouseup', () => {
  drawing = false
  if (currentTool === 'line' && shapeData) {
    undoStack.push({ type: 'line', data: shapeData })
    shapeData = null
  }
})

// Undo and Redo functionality
function undoAction() {
  if (undoStack.length > 0) {
    const lastAction = undoStack.pop()
    redoStack.push(lastAction)
    redraw()
  }
}

function redoAction() {
  if (redoStack.length > 0) {
    const lastAction = redoStack.pop()
    undoStack.push(lastAction)
    redraw()
  }
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  undoStack.forEach(action => {
    if (action.type === 'line') {
      ctx.beginPath()
      ctx.moveTo(action.data.x, action.data.y)
      ctx.lineTo(action.data.x, action.data.y)
      ctx.stroke()
    }
  })
}

// Clear Canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  undoStack = []
  redoStack = []
}

// Save Canvas as Image
function saveCanvas() {
  const dataURL = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = dataURL
  a.download = 'drawing.png'
  a.click()
}

// Shape Drawing Functions (Rectangle, Circle, etc.)
function drawRectangle(x, y, width, height) {
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.strokeStyle = brushColor
  ctx.lineWidth = brushSize
  ctx.stroke()
}

function drawCircle(x, y, radius) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = brushColor
  ctx.lineWidth = brushSize
  ctx.stroke()
}

function drawPolygon(x, y, sides, radius) {
  const angle = (2 * Math.PI) / sides
  ctx.beginPath()
  for (let i = 0; i < sides; i++) {
    const xOffset = x + radius * Math.cos(i * angle)
    const yOffset = y + radius * Math.sin(i * angle)
    if (i === 0) {
      ctx.moveTo(xOffset, yOffset)
    } else {
      ctx.lineTo(xOffset, yOffset)
    }
  }
  ctx.closePath()
  ctx.strokeStyle = brushColor
  ctx.lineWidth = brushSize
  ctx.stroke()
}

// Gradient Brush, Pattern Brush, Filters
// These would require additional code to handle complex brush styles and effects
