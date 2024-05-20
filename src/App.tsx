import React, {useEffect, useState} from 'react';
import './App.css';
import FilterPanel from './FilterPanel';
import MapFascade from "./map/MapFascade";
import {parseConfig, parseJourneys, readFileAsText} from "./config/configMapper";
import configData from "./config/config.json"
import journeyData from "./config/journeys.json"

function App() {

    // const [updates, setUpdate] = useState<number> (-1);

    // useEffect(() => {
    //     readFileAsText("./config/walks/holdsworth.txt").then( contents =>
    //         console.log(contents)
    //     );
    // });

    const stylingConfig = parseConfig(JSON.stringify(configData));
    const journeys = parseJourneys(stylingConfig, JSON.stringify(journeyData));

    const [updates, setUpdate] = useState<number> (-1);

    const handleToggleLayer = (layerIndex: number) => {
        setUpdate(layerIndex);
    };

    return (
        <div className="App">
            <div style={{ display: 'flex' }}>
                <FilterPanel onToggleLayer={handleToggleLayer} />
                <MapFascade journeys={journeys} stylingConfig={stylingConfig}/>
            </div>
        </div>
    );
};

export default App;
