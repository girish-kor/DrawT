// Setup global variables
const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')

let isDrawing = false
let currentTool = 'brush'
let brushSize = 5
let brushOpacity = 1
let brushHardness = 50
let lineThickness = 2
let textSize = 30
let textOpacity = 1
let gradientAngle = 0
let patternScale = 100
let canvasSize = 1200
let canvasOpacity = 1
let rotation = 0
let zoom = 1
let customColor = '#000000'
let backgroundColor = '#ffffff'

// Set initial canvas size and background color
canvas.width = canvasSize
canvas.height = 800
ctx.fillStyle = backgroundColor
ctx.fillRect(0, 0, canvas.width, canvas.height)

// Brush tool settings
const brush = document.querySelector('.tool-item[title="Brush Tool"]')
brush.addEventListener('click', () => {
  currentTool = 'brush'
})

// Eraser tool settings
const eraser = document.querySelector('.tool-item[title="Eraser Tool"]')
eraser.addEventListener('click', () => {
  currentTool = 'eraser'
})

// Event listeners for various tool settings
document.getElementById('brushSize').addEventListener('input', e => {
  brushSize = e.target.value
})
document.getElementById('brushOpacity').addEventListener('input', e => {
  brushOpacity = e.target.value / 100
})
document.getElementById('brushHardness').addEventListener('input', e => {
  brushHardness = e.target.value
})
document.getElementById('lineThickness').addEventListener('input', e => {
  lineThickness = e.target.value
})
document.getElementById('textSize').addEventListener('input', e => {
  textSize = e.target.value
})
document.getElementById('textOpacity').addEventListener('input', e => {
  textOpacity = e.target.value / 100
})
document.getElementById('gradientAngle').addEventListener('input', e => {
  gradientAngle = e.target.value
})
document.getElementById('patternScale').addEventListener('input', e => {
  patternScale = e.target.value
})
document.getElementById('backgroundColor').addEventListener('input', e => {
  backgroundColor = e.target.value
  canvas.style.backgroundColor = backgroundColor
})
document.getElementById('canvasOpacity').addEventListener('input', e => {
  canvasOpacity = e.target.value / 100
  ctx.globalAlpha = canvasOpacity
})
document.getElementById('rotationControl').addEventListener('input', e => {
  rotation = e.target.value
})
document.getElementById('zoomControl').addEventListener('input', e => {
  zoom = e.target.value / 100
  canvas.style.transform = `scale(${zoom})`
})

// Tool event listeners for specific tools
document.getElementById('customColor').addEventListener('input', e => {
  customColor = e.target.value
})

// Handle mouse events for drawing
canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mouseout', stopDrawing)

// Start drawing function
function startDrawing(e) {
  isDrawing = true
  ctx.beginPath()
  ctx.moveTo(e.offsetX, e.offsetY)
}

// Drawing function
function draw(e) {
  if (!isDrawing) return

  if (currentTool === 'brush') {
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = customColor
    ctx.globalAlpha = brushOpacity
    ctx.stroke()
  } else if (currentTool === 'eraser') {
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = backgroundColor
    ctx.globalAlpha = brushOpacity
    ctx.stroke()
  }
}

// Stop drawing function
function stopDrawing() {
  if (!isDrawing) return
  isDrawing = false
  ctx.beginPath()
}

// Undo functionality
let history = []
let historyIndex = -1

function saveState() {
  if (historyIndex < history.length - 1) {
    history = history.slice(0, historyIndex + 1)
  }
  history.push(canvas.toDataURL())
  historyIndex++
}

document
  .querySelector('.tool-item[title="Undo"]')
  .addEventListener('click', () => {
    if (historyIndex > 0) {
      historyIndex--
      let img = new Image()
      img.src = history[historyIndex]
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
    }
  })

document
  .querySelector('.tool-item[title="Redo"]')
  .addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
      historyIndex++
      let img = new Image()
      img.src = history[historyIndex]
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
    }
  })

// Clear canvas
document
  .querySelector('.tool-item[title="Clear Canvas"]')
  .addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  })

// Save drawing
document
  .querySelector('.tool-item[title="Save Drawing"]')
  .addEventListener('click', () => {
    const link = document.createElement('a')
    link.href = canvas.toDataURL()
    link.download = 'drawing.png'
    link.click()
  })

// Resize canvas
document.getElementById('canvasSize').addEventListener('input', e => {
  canvasSize = e.target.value
  canvas.width = canvasSize
  canvas.height = 800
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
})

// Rotate canvas
document.getElementById('rotationControl').addEventListener('input', e => {
  rotation = e.target.value
  canvas.style.transform = `rotate(${rotation}deg)`
})

// Flip horizontal
document
  .querySelector('.tool-item[title="Flip Horizontal"]')
  .addEventListener('click', () => {
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(canvas, -canvas.width, 0)
    ctx.restore()
  })

// Flip vertical
document
  .querySelector('.tool-item[title="Flip Vertical"]')
  .addEventListener('click', () => {
    ctx.save()
    ctx.scale(1, -1)
    ctx.drawImage(canvas, 0, -canvas.height)
    ctx.restore()
  })
