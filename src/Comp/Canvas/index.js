import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Input, Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import '../Spaces/spaces';

const CanvasSpaces = ({ backgroundImage, isDrawingMode }) => {
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
  
  // Form fields
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    length: '',
    height: '',
    birth: ''
  });

  const canvasRef = useRef(null);

  // Function to save shapes to local storage
  const saveShapesToLocalStorage = (shapes) => {
    localStorage.setItem('shapes', JSON.stringify(shapes));
  };

  // Function to save current shape positions
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

      drawCircle(newPosition, newPositions.length, prevPositions.length === 0); // Draw the new circle

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
            drawCircle(pos, pos.index + 1, false);
          });
        });
        
        if (shapePositions.length > 0) {
          drawShape(ctx, shapePositions);
          shapePositions.forEach((pos, index) => {
            drawCircle(pos, index === 0 ? pos.index + 1 : pos.index + 1, index === 0);
          });
        }
      };
    } else if (shapes.length > 0) {
      shapes.forEach((shape) => {
        drawShape(ctx, shape.positions);
        shape.positions.forEach((pos) => {
          drawCircle(pos, pos.index + 1, false);
        });
      });
      
      if (shapePositions.length > 0) {
        drawShape(ctx, shapePositions);
        shapePositions.forEach((pos, index) => {
          drawCircle(pos, index === 0 ? pos.index + 1 : pos.index + 1, index === 0);
        });
      }
    }
  };

   // Helper function to check if a click is inside a shape
   const isClickInsideShape = (clickPos, positions) => {
     const { minX, minY, maxX, maxY } = calculateBoundingBox(positions);

     return (
       clickPos.x >= minX &&
       clickPos.x <= maxX &&
       clickPos.y >= minY &&
       clickPos.y <= maxY
     );
   };

   const isFirstPosition = (newPos, firstPos) => {
     const tolerance = 10; 
     
     return (
       Math.abs(newPos.x - firstPos.x) < tolerance &&
       Math.abs(newPos.y - firstPos.y) < tolerance
     );
   };

   const drawCircle = (position, index, isFirstDot) => {
     const ctx = canvasRef.current.getContext('2d');
     
     ctx.beginPath();
     ctx.arc(position.x, position.y, 4, 0, 2 * Math.PI);
     
     ctx.fillStyle = isFirstDot ? 'green' : 'red';
     ctx.fill();
   };

   const drawShape = (ctx, positions) => {
     ctx.beginPath();
     
     for (let i = 0; i < positions.length - 1; i++) {
       ctx.moveTo(positions[i].x, positions[i].y);
       ctx.lineTo(positions[i + 1].x, positions[i + 1].y);
     }
     
     ctx.strokeStyle = 'red';
     ctx.lineWidth = 2;
     ctx.stroke();
   };

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

     return { minX, minY, maxX, maxY };
   };

   useEffect(() => {
     redrawCanvas(); 

     // Load previously saved incomplete shape positions from local storage on mount
     const savedPositions = localStorage.getItem('shapePositions');
     if (savedPositions) {
       setShapePositions(JSON.parse(savedPositions));
       redrawCanvas(); 
     }
   }, [shapes]);

   useEffect(() => {
     if (bgImage) {
       localStorage.setItem('backgroundImage', bgImage);
       
       const img = new Image();
       img.src = bgImage;
       
       img.onload = () => {
         redrawCanvas(); 
       };
     }
     
     else if (!bgImage && localStorage.getItem('backgroundImage')) {
       setBgImage(localStorage.getItem('backgroundImage'));
     }
     
   }, [bgImage]);

   useEffect(() => {
     if (backgroundImage) {
       localStorage.setItem('backgroundImage', backgroundImage);
       setBgImage(backgroundImage);
     }
   }, [backgroundImage]);

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
   }, [shapes]); 

   // Handle form submission in the drawer
   const handleSaveDetails = () => {
     if (selectedShapeDetails) {
       setShapes((prevShapes) =>
         prevShapes.map((shape) =>
           shape.id === selectedShapeDetails.id
             ? { ...shape,
                 name: formValues.name,
                 description: formValues.description,
                 length: formValues.length,
                 height: formValues.height,
                 birth: formValues.birth }
             : shape
         )
       );
       
       saveShapesToLocalStorage(shapes); 

       setDrawerVisible(false); 
     }
   };

   // Handle cancel button in the drawer
   const handleCancelDrawer = () => {
     setDrawerVisible(false); 
   };

   return (
     <div className="spaces-container">
       <canvas
         ref={canvasRef}
         width={600}
         height={400}
         onClick={handleClick}
       />
       
       <Drawer
         title="Edit Shape"
         placement="right"
         closable={false} // Remove close icon from drawer header
         onClose={handleCancelDrawer}
         visible={drawerVisible}
         bodyStyle={{ paddingBottom: '80px' }} 
       >
         <Form layout="vertical">
           <Form.Item label="Name">
             <Input 
               value={formValues.name} 
               onChange={(e) => setFormValues({ ...formValues,name:e.target.value})} 
             />
           </Form.Item>
           <Form.Item label="Description">
             <Input 
               value={formValues.description} 
               onChange={(e) => setFormValues({ ...formValues ,description:e.target.value})} 
             />
           </Form.Item>
           <Form.Item label="Length">
             <Input 
               value={formValues.length} 
               onChange={(e) => setFormValues({ ...formValues,length:e.target.value})} 
             />
           </Form.Item>
           <Form.Item label="Height">
             <Input 
               value={formValues.height} 
               onChange={(e) => setFormValues({ ...formValues,height:e.target.value})} 
             />
           </Form.Item>
           <Form.Item label="Birth">
             <Input 
               value={formValues.birth} 
               onChange={(e) => setFormValues({ ...formValues,birth:e.target.value})} 
             />
           </Form.Item>
           
           {/* Centering buttons */}
           <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>
             <Button type="primary" onClick={handleSaveDetails} style={{width:'110px'}}>
               Save
             </Button>
             <Button style={{ marginLeft: '10px',width:'110px' }} onClick={handleCancelDrawer}>
               Cancel
             </Button>
           </div>
         </Form>
         
       </Drawer>
     </div>
   );
};

export default CanvasSpaces;