function calculateArea(x, n, k) {
    const factor = Math.PI / 180;
    const sinPart1 = Math.sin(180 * factor / n);
    const sinPart2 = Math.sin(180 * factor * (n - 3) / n);
    const sinPart3 = Math.sin(180 * factor * (n - 4) / n);
    const sinPart4 = Math.sin(360 * factor / n);
    const sinPart5 = Math.sin(180 * factor / n);

    const numerator = (1/2) * x**2 * (sinPart1 / sinPart4) * sinPart2 * (1 - ((sinPart3 * sinPart5)**2 / sinPart4**4) ** k);
    const denominator = 1 - (sinPart3**2 * (sinPart5**2 / sinPart4**4));
    const area = numerator / denominator;
    return area;
}

function createSpidron(x, n, k) {
    const points = [];
    const angle = 360 / n;
    for (let layer = 0; layer < k; layer++) {
        const layerPoints = [];
        for (let i = 0; i < n; i++) {
            const theta = (i * angle + layer * angle / 2) * (Math.PI / 180);
            const xPoint = x * Math.cos(theta);
            const yPoint = x * Math.sin(theta);
            layerPoints.push({ x: xPoint, y: yPoint });
        }
        points.push(layerPoints);
        x /= 2;
    }
    return points;
}

function plotSpidron(x, n, k) {
    const canvas = document.getElementById('spidronCanvas');
    const ctx = canvas.getContext('2d');
    const scaleFactor = 80;  // Scale factor to make the Spidron larger
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const points = createSpidron(x, n, k);

    ctx.beginPath();
    for (let layer = 0; layer < k; layer++) {
        const layerPoints = points[layer];
        for (let i = 0; i < n; i++) {
            const start = layerPoints[i];
            const end = layerPoints[(i + 1) % n];
            ctx.moveTo(start.x * scaleFactor + offsetX, start.y * scaleFactor + offsetY);
            ctx.lineTo(end.x * scaleFactor + offsetX, end.y * scaleFactor + offsetY);
        }
        if (layer > 0) {
            const prevLayerPoints = points[layer - 1];
            for (let i = 0; i < n; i++) {
                const curr = layerPoints[i];
                const prev = prevLayerPoints[i];
                ctx.moveTo(curr.x * scaleFactor + offsetX, curr.y * scaleFactor + offsetY);
                ctx.lineTo(prev.x * scaleFactor + offsetX, prev.y * scaleFactor + offsetY);
            }
        }
    }

    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.beginPath();
    let prevLayerPoints = points[0];
    for (let layer = 1; layer < k; layer++) {
        const currLayerPoints = points[layer];
        for (let i = 0; i < n; i++) {
            const nextI = (i + 1) % n;
            const polygon = [
                prevLayerPoints[i],
                prevLayerPoints[nextI],
                currLayerPoints[nextI],
                currLayerPoints[i]
            ];
            ctx.moveTo(polygon[0].x * scaleFactor + offsetX, polygon[0].y * scaleFactor + offsetY);
            polygon.forEach(p => ctx.lineTo(p.x * scaleFactor + offsetX, p.y * scaleFactor + offsetY));
            ctx.lineTo(polygon[0].x * scaleFactor + offsetX, polygon[0].y * scaleFactor + offsetY);
        }
        prevLayerPoints = currLayerPoints;
    }

    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fill();
}


function calculateAndPlot() {
    const x = parseFloat(document.getElementById('x').value);
    const n = parseInt(document.getElementById('n').value);
    const k = parseInt(document.getElementById('k').value);

    if (isNaN(x) || isNaN(n) || isNaN(k) || x <= 0 || n <= 0 || k <= 0) {
        alert('Please enter valid numbers');
        return;
    }

    const area = calculateArea(x, n, k);
    document.getElementById('result').textContent = `Calculated area: ${area.toFixed(3)}`;

    plotSpidron(x, n, k);
}
