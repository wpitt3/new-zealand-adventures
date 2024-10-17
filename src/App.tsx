import React, {useEffect, useState} from 'react';
import './App.css';
import FilterPanel from './FilterPanel';
import MapFascade from "./map/MapFascade";
import {readFile, parseState} from "./config/configMapper";
import {AdventureConfig, AllAdventures} from "./config/adventuresDefs";

function App() {
    const [selectedJourney, setSelectedJourney] = useState<number> (-1);
    const [allAdventures, setAllAdventures] = useState<AllAdventures> ({routes:{}, adventures: []});
    const [stylingConfig, setStylingConfig] = useState<AdventureConfig> ({});

    useEffect(() => {
        const fetchFiles = async () => {
            const state = parseState(await readFile('./config/example.json'))
            setStylingConfig(state.config);
            setAllAdventures({adventures: state.adventures, routes: state.routes});
        };

        fetchFiles();
    }, []);

    const downloadState = () => {
        const stateString = JSON.stringify({config: stylingConfig, adventures: allAdventures.adventures, routes: allAdventures.routes}, null, 2);
        const blob = new Blob([stateString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'adventures.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const addRoute = () => {
        // open modal
    };

    const uploadState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const state = parseState(content)
                    setStylingConfig(state.config);
                    setAllAdventures({adventures: state.adventures, routes: state.routes});
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Invalid JSON file');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleToggleLayer = (layerIndex: number) => {
        setSelectedJourney(layerIndex);
    };

    return (
        <div className="App" >
            <FilterPanel allAdventures={allAdventures} selectedJourney={selectedJourney} onToggleLayer={handleToggleLayer} downloadState={downloadState} uploadState={uploadState} addRoute={addRoute}/>
            <MapFascade allAdventures={allAdventures} selectedJourney={selectedJourney} stylingConfig={stylingConfig}/>
        </div>
    );
}

export default App;
