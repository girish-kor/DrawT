// Select canvas and context
const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')

// Tool state variables
let currentTool = 'brush'
let brushSize = 5
let brushOpacity = 1
let brushHardness = 0.5
let lineThickness = 2
let textSize = 30
let textOpacity = 1
let isDrawing = false
let lastX = 0
let lastY = 0
let undoStack = []
let redoStack = []

// Initialize canvas settings
canvas.width = 1200
canvas.height = 800

// Set initial canvas background color
ctx.fillStyle = '#FFFFFF'
ctx.fillRect(0, 0, canvas.width, canvas.height)

// Event Listeners for brush and tool selection
document.querySelectorAll('.tool-item').forEach(item => {
  item.addEventListener('click', handleToolClick)
})

document.getElementById('brushSize').addEventListener('input', e => {
  brushSize = e.target.value
})

document.getElementById('brushOpacity').addEventListener('input', e => {
  brushOpacity = e.target.value / 100
})

document.getElementById('brushHardness').addEventListener('input', e => {
  brushHardness = e.target.value / 100
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

document.getElementById('canvasSize').addEventListener('input', e => {
  canvas.width = e.target.value
  canvas.height = e.target.value / 1.5
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
})

document.getElementById('customColor').addEventListener('input', e => {
  ctx.strokeStyle = e.target.value
  ctx.fillStyle = e.target.value
})

// Handle tool changes
function handleToolClick(e) {
  const tool = e.target
    .closest('.tool-item')
    .title.toLowerCase()
    .replace(' ', '')
  currentTool = tool
  highlightSelectedTool(tool)
}

// Highlight selected tool in the UI
function highlightSelectedTool(tool) {
  document.querySelectorAll('.tool-item').forEach(item => {
    item.classList.remove('active')
  })
  const selectedTool = document.querySelector(
    `[title="${tool.charAt(0).toUpperCase() + tool.slice(1)} Tool"]`
  )
  if (selectedTool) selectedTool.classList.add('active')
}

// Drawing logic
canvas.addEventListener('mousedown', startDrawing)
canvas.addEventListener('mousemove', draw)
canvas.addEventListener('mouseup', stopDrawing)
canvas.addEventListener('mouseout', stopDrawing)

// Start drawing
function startDrawing(e) {
  isDrawing = true
  lastX = e.offsetX
  lastY = e.offsetY
  if (currentTool === 'brush' || currentTool === 'eraser') {
    saveState() // Save state for undo functionality
  }
}

// Draw on canvas
function draw(e) {
  if (!isDrawing) return

  if (currentTool === 'brush') {
    ctx.globalAlpha = brushOpacity
    ctx.lineWidth = brushSize * brushHardness
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke()
    lastX = e.offsetX
    lastY = e.offsetY
  } else if (currentTool === 'eraser') {
    ctx.clearRect(
      e.offsetX - brushSize / 2,
      e.offsetY - brushSize / 2,
      brushSize,
      brushSize
    )
    lastX = e.offsetX
    lastY = e.offsetY
  } else if (currentTool === 'line') {
    drawLine(lastX, lastY, e.offsetX, e.offsetY)
  } else if (currentTool === 'rectangle') {
    drawRectangle(lastX, lastY, e.offsetX, e.offsetY)
  } else if (currentTool === 'circle') {
    drawCircle(lastX, lastY, e.offsetX, e.offsetY)
  } else if (currentTool === 'polygon') {
    // Add polygon drawing logic
  } else if (currentTool === 'text') {
    addText(lastX, lastY, e.offsetX, e.offsetY)
  }
}

// Stop drawing
function stopDrawing() {
  isDrawing = false
}

// Line drawing
function drawLine(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineWidth = lineThickness
  ctx.stroke()
}

// Rectangle drawing
function drawRectangle(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.rect(x1, y1, x2 - x1, y2 - y1)
  ctx.stroke()
}

// Circle drawing
function drawCircle(x1, y1, x2, y2) {
  const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  ctx.beginPath()
  ctx.arc(x1, y1, radius, 0, Math.PI * 2)
  ctx.stroke()
}

// Add text
function addText(x, y, x2, y2) {
  ctx.font = `${textSize}px Arial`
  ctx.globalAlpha = textOpacity
  ctx.fillText('Sample Text', x, y)
}

// Save current canvas state (for undo/redo functionality)
function saveState() {
  const imageData = canvas.toDataURL()
  undoStack.push(imageData)
  if (undoStack.length > 10) {
    undoStack.shift()
  }
  redoStack = []
}

// Undo drawing
document.querySelector('[title="Undo"]').addEventListener('click', () => {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop()
    redoStack.push(canvas.toDataURL())
    const img = new Image()
    img.src = lastState
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
})

// Redo drawing
document.querySelector('[title="Redo"]').addEventListener('click', () => {
  if (redoStack.length > 0) {
    const lastState = redoStack.pop()
    undoStack.push(canvas.toDataURL())
    const img = new Image()
    img.src = lastState
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
  }
})

// Clear canvas
document
  .querySelector('[title="Clear Canvas"]')
  .addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    saveState() // Save initial state for undo
  })

// Save canvas as image
document
  .querySelector('[title="Save Drawing"]')
  .addEventListener('click', () => {
    const link = document.createElement('a')
    link.href = canvas.toDataURL()
    link.download = 'drawing.png'
    link.click()
  })

// Additional event listeners and functionality can be added as needed...
