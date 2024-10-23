import React from 'react';
import { Form, Input, Button } from 'antd';

const ShapeFrom = ({ formValues, setFormValues, onSave, onCancel }) => {
    const handleInputChange = (e) => {
        setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Form layout="vertical">
            <Form.Item label="Name">
                <Input name="name" value={formValues.name} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Description">
                <Input name="description" value={formValues.description} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Length">
                <Input name="length" value={formValues.length} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Height">
                <Input name="height" value={formValues.height} onChange={handleInputChange} />
            </Form.Item>
            <Form.Item label="Birth">
                <Input name="birth" value={formValues.birth} onChange={handleInputChange} />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>
                <Button type="primary" onClick={onSave} style={{ width: '110px' }}>
                    Save
                </Button>
                <Button onClick={onCancel} style={{ width: '110px' }}>
                    Cancel
                </Button>
            </div>
        </Form>
    );
}

export default ShapeFrom