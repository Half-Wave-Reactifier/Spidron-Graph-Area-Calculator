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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const points = createSpidron(x, n, k);

    ctx.beginPath();
    for (let layer = 0; layer < k; layer++) {
        const layerPoints = points[layer];
        for (let i = 0; i < n; i++) {
            const start = layerPoints[i];
            const end = layerPoints[(i + 1) % n];
            ctx.moveTo(start.x + canvas.width / 2, start.y + canvas.height / 2);
            ctx.lineTo(end.x + canvas.width / 2, end.y + canvas.height / 2);
        }
        if (layer > 0) {
            const prevLayerPoints = points[layer - 1];
            for (let i = 0; i < n; i++) {
                const curr = layerPoints[i];
                const prev = prevLayerPoints[i];
                ctx.moveTo(curr.x + canvas.width / 2, curr.y + canvas.height / 2);
                ctx.lineTo(prev.x + canvas.width / 2, prev.y + canvas.height / 2);
            }
        }
    }

    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.beginPath();
    const prevLayerPoints = points[0];
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
            ctx.moveTo(polygon[0].x + canvas.width / 2, polygon[0].y + canvas.height / 2);
            polygon.forEach(p => ctx.lineTo(p.x + canvas.width / 2, p.y + canvas.height / 2));
            ctx.lineTo(polygon[0].x + canvas.width / 2, polygon[0].y + canvas.height / 2);
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
