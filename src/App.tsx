import React, {useState} from 'react';
import './App.css';
import MapComponent from './MapComponent';
import FilterPanel from './FilterPanel';

function App() {
    const [updates, setUpdate] = useState<number> (-1);

    const handleToggleLayer = (layerIndex: number) => {
        setUpdate(layerIndex);
    };

    return (
        <div className="App">
            <div style={{ display: 'flex' }}>
                <FilterPanel onToggleLayer={handleToggleLayer} />
                <MapComponent update={updates}/>
            </div>
        </div>
    );
};

export default App;
