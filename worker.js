self.onmessage = function(event) {
    const { grid, gridSize, action } = event.data;

    if (action === 'generateRandom') {
        const newGrid = new Map();
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (Math.random() > 0.8) {
                    newGrid.set(`${x},${y}`, 1);
                }
            }
        }
        self.postMessage({ grid: newGrid });
    } else {
        const newGrid = new Map();
        const neighborsCount = new Map();

        // Обработка всех живых клеток
        grid.forEach((_, key) => {
            const [x, y] = key.split(',').map(Number);
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue; // Пропускаем саму клетку
                    const neighborX = (x + i + gridSize) % gridSize;
                    const neighborY = (y + j + gridSize) % gridSize;
                    const neighborKey = `${neighborX},${neighborY}`;

                    // Увеличиваем количество живых соседей для каждой клетки
                    neighborsCount.set(neighborKey, (neighborsCount.get(neighborKey) || 0) + 1);
                }
            }
        });

        // Проверка условий жизни/смерти клеток
        neighborsCount.forEach((count, key) => {
            const isAlive = grid.has(key);
            if (isAlive && (count === 2 || count === 3)) {
                newGrid.set(key, 1); // Оставляем живую клетку
            } else if (!isAlive && count === 3) {
                newGrid.set(key, 1); // Рождаем новую живую клетку
            }
        });

        self.postMessage({ grid: newGrid }); // Отправляем новое состояние обратно
    }
};
