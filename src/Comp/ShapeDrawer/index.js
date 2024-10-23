import React from 'react';
import { Drawer, Form, Input, Button } from 'antd';
import ShapeForm from '../ShapeForm';


const ShapeDrawer = ({ formValues, setFormValues, visible, onSave, onCancel }) => (
  <Drawer
    title="Edit Shape"
    placement="right"
    // closable={false}
    onClose={onCancel}
    open={visible}
  >
    <ShapeForm
      formValues={formValues}
      setFormValues={setFormValues}
      onSave={onSave}
      onCancel={onCancel}
    />
  </Drawer>
);

export default ShapeDrawer;
