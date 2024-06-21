function calculateArea() {
    let x = parseFloat(document.getElementById('x').value);
    let n = parseFloat(document.getElementById('n').value);
    let k = parseFloat(document.getElementById('k').value);

    if (isNaN(x) || isNaN(n) || isNaN(k)) {
        alert("Please enter valid numbers");
        return;
    }

    // Convert degrees to radians for trigonometric functions
    let factor = Math.PI / 180;

    let sin_part1 = Math.sin(180 * factor / n);
    let sin_part2 = Math.sin(180 * factor * (n - 3) / n);
    let sin_part3 = Math.sin(180 * factor * (n - 4) / n);
    let sin_part4 = Math.sin(360 * factor / n);
    let sin_part5 = Math.sin(180 * factor / n);

    // Calculate the numerator
    let numerator = (1/2) * x**2 * (sin_part1 / sin_part4) * sin_part2 * (1 - ((sin_part3 * sin_part5)**2 / sin_part4**4) ** k);

    // Calculate the denominator
    let denominator = 1 - (sin_part3**2 * (sin_part5**2 / sin_part4**4));

    // Calculate the area
    let area = numerator / denominator;

    document.getElementById('result').innerText = `Calculated area: ${area.toFixed(3)}`;
}