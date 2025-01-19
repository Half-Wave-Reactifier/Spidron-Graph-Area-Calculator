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

    for (let layer = 0; layer <= k; layer++) { // เปลี่ยนเป็น <= k
        const layerPoints = [];
        const offsetAngle = layer * (angle / 2);
        for (let i = 0; i < n; i++) {
            const theta = (i * angle + offsetAngle) * (Math.PI / 180);
            const xPoint = x * Math.cos(theta);
            const yPoint = x * Math.sin(theta);
            layerPoints.push({ x: xPoint, y: yPoint });
        }
        points.push(layerPoints);
        x /= 2; // ลดขนาดของ Spidron ในแต่ละเลเยอร์
    }

    console.log('Spidron Points:', points); // ตรวจสอบข้อมูลที่สร้างขึ้น

    return points;
}

function plotSpidron(x, n, k) {
    const canvas = document.getElementById('spidronCanvas');
    const ctx = canvas.getContext('2d');

    // Dynamically adjust canvas size based on input
    const maxDrawingSize = x * 2; // Maximum size of the drawing
    const padding = maxDrawingSize * 0.2; // Add 20% padding around the drawing
    const canvasSize = (maxDrawingSize + padding) * 100; // Scale canvas size for better resolution

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const scaleFactor = canvasSize / (maxDrawingSize + padding); // Adjust scale factor to fit drawing
    const offsetX = canvas.width / 2; // Center the drawing
    const offsetY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const points = createSpidron(x, n, k);

    ctx.beginPath();
    for (let layer = 0; layer <= k; layer++) {
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

    // Fill the polygons with gradient color
    for (let layer = 1; layer <= k; layer++) {
        const currLayerPoints = points[layer];
        const prevLayerPoints = points[layer - 1];

        const gradient = ctx.createRadialGradient(
            offsetX, offsetY, 0,
            offsetX, offsetY, canvas.width / 2
        );
        gradient.addColorStop(0, `rgba(255, 69, 0, ${0.5 + layer * 0.1})`);
        gradient.addColorStop(1, `rgba(255, 165, 0, ${0.2 + layer * 0.05})`);

        for (let i = 0; i < n; i++) {
            const nextI = (i + 1) % n;
            const polygon = [
                prevLayerPoints[i],
                prevLayerPoints[nextI],
                currLayerPoints[nextI],
                currLayerPoints[i]
            ];

            ctx.beginPath();
            ctx.moveTo(polygon[0].x * scaleFactor + offsetX, polygon[0].y * scaleFactor + offsetY);
            polygon.forEach(p => ctx.lineTo(p.x * scaleFactor + offsetX, p.y * scaleFactor + offsetY));
            ctx.closePath();

            if (i === 0) {
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }
}


function calculateAndPlot() {
    const x = parseFloat(document.getElementById('x').value);
    const n = parseInt(document.getElementById('n').value);
    const k = parseInt(document.getElementById('k').value);

    if (isNaN(x) || isNaN(n) || isNaN(k) || x <= 0 || n <= 4 || k <= 0) {
        alert('Please enter valid numbers and ensure n > 4');
        return;
    }

    console.log('Parameters:', { x, n, k }); // ตรวจสอบค่าที่ใช้ในการคำนวณ

    const area = calculateArea(x, n, k);
    document.getElementById('result').textContent = `Calculated area: ${area.toFixed(3)}`;

    plotSpidron(x, n, k);
}
