import React, { useState } from 'react';
import ShapeDrawer from '../ShapeDrawer';
import Canvas from '../Canvas';
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
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    length: '',
    height: '',
    birth: '',
  });


  const [selectedShapeDetails, setSelectedShapeDetails] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleShapeClick = (clickedShape) => {
    setSelectedShapeDetails(clickedShape);
    setDrawerVisible(true); // Show the drawer
  };

  const handleSaveShapeDetails = (updatedShape) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === updatedShape.id ? updatedShape : shape
      )
    );
    setDrawerVisible(false);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="spaces-container">
      <Canvas
        backgroundImage={backgroundImage}
        isDrawingMode={isDrawingMode}
        shapePositions={shapePositions}
        setShapePositions={setShapePositions}
        shapes={shapes}
        setShapes={setShapes}
        setSelectedShapeDetails={handleShapeClick}
        setFormValues={setFormValues}
        setDrawerVisible={setDrawerVisible}
      />
      <ShapeDrawer
        formValues={formValues}
        setFormValues={setFormValues}
        visible={drawerVisible}
        onSave={handleSaveShapeDetails}
        onClose={handleCloseDrawer}
        onCancel={handleCloseDrawer}
      />

    </div>
  );
};

export default Spaces;
