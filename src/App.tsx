import React, {useEffect, useState} from 'react';
import './App.css';
import FilterPanel from './FilterPanel';
import MapFascade from "./map/MapFascade";
import {parseConfig, parseAdventures, readFile} from "./config/configMapper";
import {AdventureConfig, AllAdventures} from "./config/adventuresDefs";

function App() {
    const [selectedJourney, setSelectedJourney] = useState<number> (-1);
    const [allAdventures, setAllAdventures] = useState<AllAdventures> ({routes:{}, adventures: []});
    const [stylingConfig, setStylingConfig] = useState<AdventureConfig> ({});

    useEffect(() => {


        const fetchFiles = async () => {
            const sc = parseConfig(await readFile('./config/adventureConfig.json'))
            const ad = parseAdventures(sc, await readFile('./config/journeys.json'))
            console.log(sc)
            console.log(ad)
            setStylingConfig(sc);
            setAllAdventures(ad);
        };

        fetchFiles();
    }, []);

    const handleToggleLayer = (layerIndex: number) => {
        setSelectedJourney(layerIndex);
    };

    return (
        <div className="App" >
            <FilterPanel allAdventures={allAdventures} selectedJourney={selectedJourney} onToggleLayer={handleToggleLayer} />
            <MapFascade allAdventures={allAdventures} selectedJourney={selectedJourney} stylingConfig={stylingConfig}/>
        </div>
    );
};

export default App;
