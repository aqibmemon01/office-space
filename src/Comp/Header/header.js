import React from 'react';
import './header.css'; // Import Header styles
import ImageUploader from '../ImageUploader/imageUploader';
import penIcon from '../../Assets/pen-tool.png';
import arrowIcon from '../../Assets/next.png';

const Header = ({ onImageUpload, onPenClick, onArrowClick, onUndo, onRedo }) => {
  return (
    <header className="header">
      <ImageUploader onImageUpload={onImageUpload} />

      {/* Arrow and Pen buttons */}
      <button className="header-button" onClick={onPenClick} title='Draw'>
        <img src={penIcon} width={20}/>
      </button>
      <button className="header-button" onClick={onArrowClick} title='Move'>
        <img src={arrowIcon} width={20}/>
      </button>

      {/* <button className="header-button" onClick={onUndo}>Undo</button>
      <button className="header-button" onClick={onRedo}>Redo</button> */}
    </header>
  );
};

export default Header;
