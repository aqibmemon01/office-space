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

export const isClickInsideShape = (clickPosition, shapePositions) => {
    return isPointInPolygon(clickPosition, shapePositions);
};

export const isFirstPosition = (newPos, firstPos) => {
    const tolerance = 10;
    return Math.abs(newPos.x - firstPos.x) < tolerance && Math.abs(newPos.y - firstPos.y) < tolerance;
};

const isPointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};
