export const drawCircle = (canvasRef, position, index, isFirstDot) => {
    if (!canvasRef.current) {
        console.error("Canvas is not yet rendered or canvasRef is not defined.");
        return;
    }
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
        console.error("Failed to get canvas context.");
        return;
    }

    ctx.beginPath();
    ctx.arc(position.x, position.y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = isFirstDot ? 'green' : 'red';
    ctx.fill();
};

export const drawShape = (ctx, positions) => {
    ctx.beginPath();
    positions.forEach((pos, i) => {
        if (i === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
    });
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
};

export const isClickInsideShape = (clickPos, positions) => {
    const { minX, minY, maxX, maxY } = calculateBoundingBox(positions);
    return clickPos.x >= minX && clickPos.x <= maxX && clickPos.y >= minY && clickPos.y <= maxY;
};

export const isFirstPosition = (newPos, firstPos) => {
    const tolerance = 10;
    return Math.abs(newPos.x - firstPos.x) < tolerance && Math.abs(newPos.y - firstPos.y) < tolerance;
};

const calculateBoundingBox = (positions) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    positions.forEach(({ x, y }) => {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    });
    return { minX, minY, maxX, maxY };
};
