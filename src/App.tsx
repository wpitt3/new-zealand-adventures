import React, {useEffect, useState} from 'react';
import './App.css';
import FilterPanel from './FilterPanel';
import MapFascade from "./map/MapFascade";
import {Journey, LocationConfig, parseConfig, parseJourneys, PathConfig} from "./config/configMapper";
import configData from "./config/config.json"
import journeyData from "./config/journeys.json"

function App() {
    const [selectedJourney, setSelectedJourney] = useState<number> (-1);
    const [journeys, setJourneys] = useState<Journey[]> ([]);
    const [stylingConfig, setStylingConfig] = useState<Map<string, PathConfig|LocationConfig>> (new Map());

    useEffect(() => {
        const stylingConfig = parseConfig(JSON.stringify(configData));
        setStylingConfig(stylingConfig);

        const fetchFiles = async () => {
            setJourneys(await parseJourneys(stylingConfig, JSON.stringify(journeyData)));
        };

        fetchFiles();
    }, []);

    const handleToggleLayer = (layerIndex: number) => {
        setSelectedJourney(layerIndex);
    };

    return (
        <div className="App" >
            <FilterPanel journeys={journeys} selectedJourney={selectedJourney} onToggleLayer={handleToggleLayer} />
            <MapFascade journeys={journeys} selectedJourney={selectedJourney} stylingConfig={stylingConfig}/>
        </div>
    );
};

export default App;
