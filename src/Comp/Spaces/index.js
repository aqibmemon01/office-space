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
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleSaveShapeDetails = (updatedShape) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id === updatedShape.id ? updatedShape : shape
    );
    setShapes(updatedShapes);
    localStorage.setItem('shapes', JSON.stringify(updatedShapes));
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
        setFormValues={setFormValues}
        setDrawerVisible={setDrawerVisible}
      />
      <ShapeDrawer
        formValues={formValues}
        setFormValues={setFormValues}
        visible={drawerVisible}
        onSave={() => handleSaveShapeDetails(formValues)}
        onClose={handleCloseDrawer}
        onCancel={handleCloseDrawer}
      />

    </div>
  );
};

export default Spaces;
