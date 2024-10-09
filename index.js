let gridSize = 20;
let grid = new Map();
let isRunning = false;
let cells = [];

const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const randomBtn = document.getElementById('random');
const clearBtn = document.getElementById('clear');
const sizeInput = document.getElementById('size');
const gameGrid = document.getElementById('game');

const worker = new Worker('worker.js');


function getKey(x, y) {
    return `${x},${y}`;
}


function drawGrid() {
    gameGrid.style.gridTemplate = `repeat(${gridSize}, 20px)/repeat(${gridSize}, 20px)`;

    gameGrid.innerHTML = '';
    cells = [];

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gameGrid.appendChild(cell);
        cells.push(cell);
    }

    cells.forEach((cell, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        const key = getKey(x, y);

        if (grid.has(key)) {
            cell.classList.add('alive');
        } else {
            cell.classList.remove('alive');
        }

        cell.onclick = () => {
            if (grid.has(key)) {
                grid.delete(key);
            } else {
                grid.set(key, 1);
            }
            drawGrid();
        };
    });
}


function updateGrid() {
    const startTime = performance.now();
    worker.postMessage({ grid, gridSize, action: 'update' });

    worker.onmessage = function(event) {
        grid = event.data.grid;
        drawGrid();
        const endTime = performance.now();
        document.getElementById('time').innerText = `${(endTime - startTime).toFixed(2)}`;
    };
}


function update() {
    if (isRunning) {
        updateGrid();
        requestAnimationFrame(update);
    }
}


function generateRandom() {
    worker.postMessage({ gridSize, action: 'generateRandom' });

    worker.onmessage = function(event) {
        grid = event.data.grid;
        drawGrid();
    };
}

function setDisable() {
    startBtn.setAttribute("disabled","disabled")
    startBtn.classList.add("disabled")
    randomBtn.setAttribute("disabled","disabled")
    randomBtn.classList.add("disabled")
    clearBtn.setAttribute("disabled","disabled")
    clearBtn.classList.add("disabled")
    sizeInput.setAttribute("disabled","disabled")
}

function removeDisable() {
    startBtn.removeAttribute("disabled");
    startBtn.classList.remove("disabled");
    randomBtn.removeAttribute("disabled");
    randomBtn.classList.remove("disabled");
    clearBtn.removeAttribute("disabled");
    clearBtn.classList.remove("disabled");
    sizeInput.removeAttribute("disabled");
}

startBtn.addEventListener('click', () => {
    isRunning = true;
    setDisable()
    update();
});

stopBtn.addEventListener('click', () => {
    isRunning = false; 
    removeDisable()  
});

randomBtn.addEventListener('click', () => {
    generateRandom();
});

clearBtn.addEventListener('click', () => {
    grid.clear();
    drawGrid();
});

document.getElementById('size').addEventListener('input', (event) => {
    gridSize = parseInt(event.target.value);
    drawGrid();
});


drawGrid();