import React, { useState, useEffect, useRef } from 'react';
import { Drawer, List } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import './spaces.css';

const Spaces = ({ backgroundImage, isDrawingMode }) => {
  const [shapePositions, setShapePositions] = useState(() => {
    const savedPositions = localStorage.getItem('shapePositions');
    return savedPositions ? JSON.parse(savedPositions) : [];
  });
  const [shapes, setShapes] = useState(() => {
    const savedShapes = localStorage.getItem('shapes');
    return savedShapes ? JSON.parse(savedShapes) : [];
  });
  const [bgImage, setBgImage] = useState(() => {
    return localStorage.getItem('backgroundImage') || backgroundImage;
  });
  const [selectedShapeDetails, setSelectedShapeDetails] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const containerRef = useRef(null);

  const handleClick = (event) => {
    if (!isDrawingMode) return;
  
    const containerRect = containerRef.current.getBoundingClientRect();
    const xPos = event.clientX - containerRect.left;
    const yPos = event.clientY - containerRect.top;
    const newPosition = { x: xPos, y: yPos };
  
    setShapePositions((prevPositions) => {
      const newPositions = [...prevPositions, newPosition];
  
      // Check if the user closes the shape (by clicking near the first point)
      if (newPositions.length > 1 && isFirstPosition(newPosition, newPositions[0])) {
        setShapes((prevShapes) => {
          // Check if the shape already exists in localStorage
          const savedShapes = JSON.parse(localStorage.getItem('shapes')) || [];
  
          // Define a helper function to compare shapes
          const areShapesEqual = (shape1, shape2) => {
            if (shape1.length !== shape2.length) return false;
            return shape1.every((pos, index) => 
              pos.x === shape2[index].x && pos.y === shape2[index].y
            );
          };
  
          // Check if the new shape matches any existing shape
          const isDuplicateShape = savedShapes.some(savedShape => 
            areShapesEqual(savedShape.positions, newPositions)
          );
  
          if (isDuplicateShape) {
            console.log("okkShape already exists, not adding.");
            return prevShapes; // Skip adding if the shape already exists
          }
  
          // If not a duplicate, add the new shape
          const newShape = { id: uuidv4(), positions: newPositions };
          const updatedShapes = [...prevShapes, newShape];
  
          // Save the new shape to localStorage
          localStorage.setItem('shapes', JSON.stringify(updatedShapes));
  
          return updatedShapes;
        });
  
        // Clear current shape positions after shape completion
        localStorage.removeItem('shapePositions');
        return [];
      }
  
      // Save current shape positions to localStorage
      localStorage.setItem('shapePositions', JSON.stringify(newPositions));
      return newPositions;
    });
  };
  
  const handleShapeClick = (shapeId) => {
    if (isDrawingMode) return;

    const shape = shapes.find((s) => s.id === shapeId);
    if (shape) {
      setSelectedShapeDetails(shape);
      setDrawerVisible(true);
    }
  };

  const isFirstPosition = (newPos, firstPos) => {
    const tolerance = 10;
    return (
      Math.abs(newPos.x - firstPos.x) < tolerance &&
      Math.abs(newPos.y - firstPos.y) < tolerance
    );
  };

  useEffect(() => {
    if (bgImage && containerRef.current && isDrawingMode) {
      containerRef.current.addEventListener('click', handleClick);
      return () => {
        containerRef.current.removeEventListener('click', handleClick);
      };
    }
  }, [bgImage, isDrawingMode]);

  useEffect(() => {
    if (backgroundImage) {
      localStorage.setItem('backgroundImage', backgroundImage);
      setBgImage(backgroundImage);
    }
  }, [backgroundImage]);

  // Define the renderLines function
  const renderLines = (positions) => {
    if (!positions || !Array.isArray(positions)) return null;
    return positions.map((pos, index) => {
      if (index < positions.length - 1) {
        const nextPos = positions[index + 1];
        return (
          <line
            key={index}
            x1={pos.x}
            y1={pos.y}
            x2={nextPos.x}
            y2={nextPos.y}
            stroke="red"
            strokeWidth="2"
          />
        );
      }
      return null;
    });
  };

  // Calculate bounding box for a shape
  const calculateBoundingBox = (positions) => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    positions.forEach((pos) => {
      if (pos.x < minX) minX = pos.x;
      if (pos.y < minY) minY = pos.y;
      if (pos.x > maxX) maxX = pos.x;
      if (pos.y > maxY) maxY = pos.y;
    });

    return { minX, minY, width: maxX - minX, height: maxY - minY };
  };

  return (
    <div
      ref={containerRef}
      className="spaces-container"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
      }}
    >
      {!bgImage && (
        <div className="no-image">
          No Image Uploaded
        </div>
      )}

      {
        <svg className="lines-svg" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
          {renderLines(shapePositions)}
          {shapePositions.map((pos, index) => (
            <circle
              key={index}
              cx={pos.x}
              cy={pos.y}
              r="4"
              fill={index === 0 ? 'green' : 'red'}
            />
          ))}
        </svg>
      }

      {shapes.map((shape) => {
        const { minX, minY } = calculateBoundingBox(shape.positions);

        return (
          <svg
            key={shape.id}
            onClick={() => handleShapeClick(shape.id)}
            style={{
              position: 'absolute',
              top: minY,
              left: minX,
              cursor: isDrawingMode ? 'default' : 'pointer',
              overflow: 'visible'
            }}
          >
            {renderLines(shape.positions.map(pos => ({ x: pos.x - minX, y: pos.y - minY })))}
            {shape.positions.map((pos, index) => (
              <circle
                key={index}
                cx={pos.x - minX} // Adjust position relative to bounding box
                cy={pos.y - minY} // Adjust position relative to bounding box
                r="4"
                fill="red"
                style={{ pointerEvents: 'none' }} // Ensure circles don't block clicks on lines
              />
            ))}
          </svg>
        );
      })}

      <Drawer
        title={`Shape ID: ${selectedShapeDetails?.id}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible} // Ensure this prop is used for visibility control
      >
        <List
          dataSource={selectedShapeDetails?.positions || []}
          renderItem={(pos, index) => (
            <List.Item>
              Point {index + 1}: (x: {pos.x}, y: {pos.y})
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
};

export default Spaces;