// Get elements
const canvas = document.getElementById('drawingCanvas')
const ctx = canvas.getContext('2d')

const brushSizeSlider = document.getElementById('brushSize')
const brushOpacitySlider = document.getElementById('brushOpacity')
const brushHardnessSlider = document.getElementById('brushHardness')
const lineThicknessSlider = document.getElementById('lineThickness')
const textSizeSlider = document.getElementById('textSize')
const textOpacitySlider = document.getElementById('textOpacity')
const gradientAngleSlider = document.getElementById('gradientAngle')
const shadowIntensitySlider = document.getElementById('shadowIntensity')
const patternScaleSlider = document.getElementById('patternScale')
const backgroundColorPicker = document.getElementById('backgroundColor')
const customColorPicker = document.getElementById('customColor')
const canvasOpacitySlider = document.getElementById('canvasOpacity')
const rotationControlSlider = document.getElementById('rotationControl')
const zoomControlSlider = document.getElementById('zoomControl')

let brushColor = '#000000'
let isDrawing = false
let currentTool = 'brush'
let brushSize = 5
let brushOpacity = 100
let brushHardness = 50
let lineThickness = 2
let textSize = 30
let textOpacity = 100
let gradientAngle = 0
let shadowIntensity = 50
let patternScale = 100
let canvasOpacity = 100
let rotation = 0
let zoom = 1

// Function to set canvas background color
function setBackgroundColor() {
  canvas.style.backgroundColor = backgroundColorPicker.value
}

// Function to update canvas opacity
function updateCanvasOpacity() {
  canvas.style.opacity = canvasOpacitySlider.value / 100
}

// Function to update canvas zoom
function updateZoom() {
  canvas.style.transform = `scale(${zoomControlSlider.value / 100})`
}

// Handle mouse events for drawing
canvas.addEventListener('mousedown', e => {
  isDrawing = true
  draw(e)
})

canvas.addEventListener('mousemove', e => {
  if (isDrawing) {
    draw(e)
  }
})

canvas.addEventListener('mouseup', () => {
  isDrawing = false
  ctx.beginPath()
})

canvas.addEventListener('mouseout', () => {
  isDrawing = false
  ctx.beginPath()
})

// Draw function based on selected tool
function draw(e) {
  ctx.lineWidth = brushSize
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = brushOpacity / 100

  if (currentTool === 'brush') {
    ctx.strokeStyle = brushColor
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
    ctx.stroke()
  } else if (currentTool === 'eraser') {
    ctx.clearRect(
      e.clientX - canvas.offsetLeft,
      e.clientY - canvas.offsetTop,
      brushSize,
      brushSize
    )
  }
}

// Switch tools (Brush, Eraser, Line, Rectangle, etc.)
function switchTool(tool) {
  currentTool = tool
}

// Handle brush color change
customColorPicker.addEventListener('input', e => {
  brushColor = e.target.value
})

// Handle brush size change
brushSizeSlider.addEventListener('input', e => {
  brushSize = e.target.value
})

// Handle brush opacity change
brushOpacitySlider.addEventListener('input', e => {
  brushOpacity = e.target.value
})

// Handle brush hardness change
brushHardnessSlider.addEventListener('input', e => {
  brushHardness = e.target.value
})

// Handle line thickness change
lineThicknessSlider.addEventListener('input', e => {
  lineThickness = e.target.value
})

// Handle text size change
textSizeSlider.addEventListener('input', e => {
  textSize = e.target.value
})

// Handle text opacity change
textOpacitySlider.addEventListener('input', e => {
  textOpacity = e.target.value
})

// Handle gradient angle change
gradientAngleSlider.addEventListener('input', e => {
  gradientAngle = e.target.value
})

// Handle shadow intensity change
shadowIntensitySlider.addEventListener('input', e => {
  shadowIntensity = e.target.value
})

// Handle pattern scale change
patternScaleSlider.addEventListener('input', e => {
  patternScale = e.target.value
})

// Handle background color change
backgroundColorPicker.addEventListener('input', () => {
  setBackgroundColor()
})

// Handle canvas opacity change
canvasOpacitySlider.addEventListener('input', () => {
  updateCanvasOpacity()
})

// Handle canvas zoom control
zoomControlSlider.addEventListener('input', () => {
  updateZoom()
})

// Handle canvas rotation
rotationControlSlider.addEventListener('input', () => {
  rotation = rotationControlSlider.value
  canvas.style.transform = `rotate(${rotation}deg) scale(${
    zoomControlSlider.value / 100
  })`
})

// Handle undo and redo
let undoStack = []
let redoStack = []

function undo() {
  if (undoStack.length > 0) {
    const lastState = undoStack.pop()
    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    ctx.putImageData(lastState, 0, 0)
  }
}

function redo() {
  if (redoStack.length > 0) {
    const redoState = redoStack.pop()
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    ctx.putImageData(redoState, 0, 0)
  }
}

// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
}

// Function to save the drawing
function saveDrawing() {
  const dataUrl = canvas.toDataURL()
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = 'drawing.png'
  link.click()
}

// Add event listeners to the tool panel
document.querySelectorAll('.tool-item').forEach(toolItem => {
  toolItem.addEventListener('click', () => {
    const tool = toolItem.title
      .toLowerCase()
      .replace(' tool', '')
      .replace(' ', '')
    switchTool(tool)
  })
})

// Add event listeners for undo, redo, clear, and save actions
document.querySelector("[title='Undo']").addEventListener('click', undo)
document.querySelector("[title='Redo']").addEventListener('click', redo)
document
  .querySelector("[title='Clear Canvas']")
  .addEventListener('click', clearCanvas)
document
  .querySelector("[title='Save Drawing']")
  .addEventListener('click', saveDrawing)
