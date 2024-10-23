import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { drawCircle, drawShape, isFirstPosition, isClickInsideShape } from '../../Utils/canvasUtils';

const Canvas = ({ backgroundImage, isDrawingMode, shapes, setShapes, setSelectedShapeDetails, setFormValues, setDrawerVisible }) => {
  const [shapePositions, setShapePositions] = useState(() => {
    const savedPositions = localStorage.getItem('shapePositions');
    return savedPositions ? JSON.parse(savedPositions) : [];
  });

  const [bgImage, setBgImage] = useState(() => {
    return localStorage.getItem('backgroundImage') || backgroundImage;
  });

  const canvasRef = useRef(null);

  const saveShapesToLocalStorage = (shapes) => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
  };

  const saveCurrentShapePositionsToLocalStorage = (positions) => {
    localStorage.setItem('shapePositions', JSON.stringify(positions));
  };

  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!isDrawingMode) {
      // Check if clicked inside any shape's bounding box
      const clickedShape = shapes.find((shape) =>
        isClickInsideShape({ x, y }, shape.positions)
      );

      if (clickedShape) {
        setSelectedShapeDetails(clickedShape);
        setFormValues({
          name: clickedShape.name || '',
          description: clickedShape.description || '',
          length: clickedShape.length || '',
          height: clickedShape.height || '',
          birth: clickedShape.birth || ''
        });
        setDrawerVisible(true); // Open the drawer with shape details
      }
      return;
    }

    // Drawing mode logic
    const newPosition = { x, y };

    setShapePositions((prevPositions) => {
      const newPositions = [...prevPositions, newPosition];

      drawCircle(canvasRef, newPosition, newPositions.length, prevPositions.length === 0);

      if (newPositions.length > 1) {
        drawShape(canvas.getContext('2d'), newPositions); // Draw lines progressively
      }

      // Save current positions to local storage
      saveCurrentShapePositionsToLocalStorage(newPositions);

      // Check if the new position is near the first position to complete the shape
      if (
        newPositions.length > 1 &&
        isFirstPosition(newPosition, newPositions[0])
      ) {
        const newShape = { id: uuidv4(), positions: newPositions };
        setShapes((prevShapes) => {
          const updatedShapes = [...prevShapes, newShape];
          saveShapesToLocalStorage(updatedShapes); // Save updated shapes to local storage
          return updatedShapes;
        });

        setShapePositions([]); // Reset positions for next shape
        saveCurrentShapePositionsToLocalStorage([]); // Clear saved positions in local storage

        redrawCanvas(); // Redraw canvas with all shapes
        return [];
      }

      return newPositions;
    });
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bgImage) {
      const img = new Image();
      img.src = bgImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        shapes.forEach((shape) => {
          drawShape(ctx, shape.positions);
          shape.positions.forEach((pos) => {
            drawCircle(canvasRef, pos, pos.index + 1, false);
          });
        });

        if (shapePositions.length > 0) {
          drawShape(ctx, shapePositions);
          shapePositions.forEach((pos, index) => {
            drawCircle(canvasRef, pos, index === 0 ? pos.index + 1 : pos.index + 1, index === 0);
          });
        }
      };
    }
  };

  useEffect(() => {
    redrawCanvas();
  }, [shapes]);

  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem('backgroundImage', backgroundImage);
      setBgImage(backgroundImage);
      redrawCanvas();
    }
  }, [backgroundImage,bgImage]);

  // Cursor management using useEffect for isDrawingMode
  useEffect(() => {
    const canvas = canvasRef.current;

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (!isDrawingMode) {
        // Check if mouse is over any shape or point
        const isOverShapeOrPoint =
          shapes.some((shape) =>
            isClickInsideShape({ x, y }, shape.positions)
          );

        canvas.style.cursor =
          isOverShapeOrPoint ? 'pointer' : 'default';
      } else {
        canvas.style.cursor = 'crosshair';
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [shapes, isDrawingMode]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      onClick={handleClick}
    />
  );
};

export default Canvas;
