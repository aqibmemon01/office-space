import React, { useState, useRef } from "react";
import Header from "./Comp/Header/header";
import Spaces from "./Comp/Spaces";

function App() {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const undoRedoManager = useRef({ undo: () => { }, redo: () => { } });

  const handlePenClick = () => {
    setIsDrawingMode(true);
  };

  const handleArrowClick = () => {
    setIsDrawingMode(false);
  };

  return (
    <div>
      <Header
        onImageUpload={setBackgroundImage}
        onUndo={undoRedoManager.current.undo}
        onRedo={undoRedoManager.current.redo}
        onPenClick={handlePenClick}
        onArrowClick={handleArrowClick}
      />
      <Spaces
        backgroundImage={backgroundImage}
        undoRedoManager={undoRedoManager}
        isDrawingMode={isDrawingMode}
      />
    </div>
  );
}

export default App;
