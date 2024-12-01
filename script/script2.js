// Initialize necessary variables
let canvas = document.getElementById('drawingCanvas')
let ctx = canvas.getContext('2d')

let isDrawing = false
let brushColor = '#000000'
let brushSize = 5
let brushOpacity = 1
let brushHardness = 50
let currentTool = 'brush'
let lineThickness = 2
let textOpacity = 100
let textSize = 30
let gradientAngle = 0
let shadowIntensity = 50
let zoomLevel = 1
let rotateAngle = 0
let customPattern = null
let backgroundColor = '#ffffff'

// Canvas resizing
document.getElementById('canvasSize').addEventListener('input', e => {
  canvas.width = e.target.value
  canvas.height = e.target.value * (canvas.height / canvas.width)
})

// Brush size control
document.getElementById('brushSize').addEventListener('input', e => {
  brushSize = e.target.value
})

// Brush opacity control
document.getElementById('brushOpacity').addEventListener('input', e => {
  brushOpacity = e.target.value / 100
  ctx.globalAlpha = brushOpacity
})

// Brush hardness control
document.getElementById('brushHardness').addEventListener('input', e => {
  brushHardness = e.target.value
})

// Line thickness control
document.getElementById('lineThickness').addEventListener('input', e => {
  lineThickness = e.target.value
})

// Text size control
document.getElementById('textSize').addEventListener('input', e => {
  textSize = e.target.value
})

// Text opacity control
document.getElementById('textOpacity').addEventListener('input', e => {
  textOpacity = e.target.value
})

// Gradient angle control
document.getElementById('gradientAngle').addEventListener('input', e => {
  gradientAngle = e.target.value
})

// Shadow intensity control
document.getElementById('shadowIntensity').addEventListener('input', e => {
  shadowIntensity = e.target.value
})

// Pattern scale control
document.getElementById('patternScale').addEventListener('input', e => {
  patternScale = e.target.value
})

// Background color control
document.getElementById('backgroundColor').addEventListener('input', e => {
  backgroundColor = e.target.value
  canvas.style.backgroundColor = backgroundColor
})

// Canvas opacity control
document.getElementById('canvasOpacity').addEventListener('input', e => {
  canvas.style.opacity = e.target.value / 100
})

// Rotation control
document.getElementById('rotationControl').addEventListener('input', e => {
  rotateAngle = e.target.value
  canvas.style.transform = `rotate(${rotateAngle}deg)`
})

// Zoom control
document.getElementById('zoomControl').addEventListener('input', e => {
  zoomLevel = e.target.value / 100
  canvas.style.transform = `scale(${zoomLevel})`
})

// Set brush color
document.getElementById('customColor').addEventListener('input', e => {
  brushColor = e.target.value
  ctx.strokeStyle = brushColor
  ctx.fillStyle = brushColor
})

// Clear canvas
document
  .querySelector('[title="Clear Canvas"]')
  .addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  })

// Undo and Redo functionality
let history = []
let undoneHistory = []

function saveState() {
  history.push(canvas.toDataURL())
  if (history.length > 10) history.shift()
}

function undo() {
  if (history.length > 1) {
    undoneHistory.push(history.pop())
    let img = new Image()
    img.src = history[history.length - 1]
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
}

function redo() {
  if (undoneHistory.length > 0) {
    let img = new Image()
    img.src = undoneHistory.pop()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
}

document.querySelector('[title="Undo"]').addEventListener('click', undo)
document.querySelector('[title="Redo"]').addEventListener('click', redo)

// Save canvas
document
  .querySelector('[title="Save Drawing"]')
  .addEventListener('click', () => {
    let dataUrl = canvas.toDataURL()
    let link = document.createElement('a')
    link.href = dataUrl
    link.download = 'drawing.png'
    link.click()
  })

// Tool selection
document.querySelectorAll('.tool-item').forEach(item => {
  item.addEventListener('click', () => {
    currentTool = item.title.toLowerCase().replace(' ', '')
  })
})

// Handle drawing
canvas.addEventListener('mousedown', e => {
  isDrawing = true
  ctx.beginPath()
  ctx.moveTo(e.offsetX, e.offsetY)
  saveState()
})

canvas.addEventListener('mousemove', e => {
  if (isDrawing) {
    switch (currentTool) {
      case 'brush':
        ctx.lineTo(e.offsetX, e.offsetY)
        ctx.lineWidth = brushSize
        ctx.stroke()
        break
      case 'eraser':
        ctx.clearRect(e.offsetX, e.offsetY, brushSize, brushSize)
        break
      case 'line':
        // Implement line drawing logic
        break
      case 'rectangle':
        // Implement rectangle drawing logic
        break
      case 'circle':
        // Implement circle drawing logic
        break
      case 'polygon':
        // Implement polygon drawing logic
        break
      case 'text':
        // Implement text drawing logic
        break
      case 'gradient':
        // Implement gradient brush drawing logic
        break
      case 'pattern':
        // Implement pattern brush drawing logic
        break
      default:
        break
    }
  }
})

canvas.addEventListener('mouseup', () => {
  isDrawing = false
})
