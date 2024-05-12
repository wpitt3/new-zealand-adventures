// FilterPanel.tsx

import React from 'react';

const FilterPanel: React.FC<{ onToggleLayer: (layerIndex: number) => void }> = ({ onToggleLayer }) => {
    const handleToggleLayer = (layerIndex: number) => {
        onToggleLayer(layerIndex);
    };

    return (
        <div style={{ width: '150px', height: '100vh', backgroundColor: '#f0f0f0'}}>
            <h2>Filter Panel</h2>
            <hr />
            <label>
                <input type="checkbox" defaultChecked onChange={() => handleToggleLayer(0)} /> Campervan
            </label>
            <br />
            <label>
                <input type="checkbox" defaultChecked onChange={() => handleToggleLayer(1)} /> Hut
            </label>
            <br />
            <label>
                <input type="checkbox" defaultChecked onChange={() => handleToggleLayer(2)} /> Walk
            </label>
            <br />
            <label>
                <input type="checkbox" defaultChecked onChange={() => handleToggleLayer(3)} /> Kayak
            </label>
        </div>
    );
};

export default FilterPanel;
