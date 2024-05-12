// App.tsx

import React from 'react';
import './App.css';
import MapComponent from './MapComponent';
import FilterPanel from './FilterPanel';

const App: React.FC = () => {
    const handleToggleLayer = (layerIndex: number) => {
        // Implement logic to toggle layer visibility
    };

    return (
        <div className="App">
            <div style={{ display: 'flex' }}>
                <FilterPanel onToggleLayer={handleToggleLayer} />
                <MapComponent />
            </div>
        </div>
    );
};

export default App;
