import React, {useEffect, useState} from 'react';
import './App.css';
import MapFascade from "./map/MapFascade";
import {readFile, parseState} from "./config/configMapper";
import {AdventureConfig, AllAdventures, Coordinate} from "./config/adventuresDefs";
import AdventureSidebar from "./MuiFilterPanel";
import {RouteParser} from "./RouteParser";


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

    const removeRoute = (name: string) => {
        setAllAdventures({adventures: allAdventures.adventures, routes: Object.fromEntries(Object.entries(allAdventures.routes).filter(([key]) => name !== key))})
    };

    const uploadState = (content: string) => {
        const state = parseState(content)
        setStylingConfig(state.config);
        setAllAdventures({adventures: state.adventures, routes: state.routes});
    };

    const addRoute = (content: string) => {
        try {
            const route = RouteParser.parse(content)
            route.name = route.name || "New Route"
            console.log(route.trackPoints)
            console.log(route.waypoints)
            setAllAdventures({
                adventures: allAdventures.adventures,
                routes: {...allAdventures.routes, [route.name]: route.trackPoints.map(value => [value.y, value.x, value.z] as Coordinate)}
            })

        } catch (error) {
            console.error('Error parsing Route:', error);
            throw error;
        }
    };

    const handleToggleLayer = (layerIndex: number) => {
        setSelectedJourney(layerIndex);
    };

    return (
        <div className="App" >
            <AdventureSidebar allAdventures={allAdventures} downloadState={downloadState} uploadState={uploadState} addRoute={addRoute} removeRoute={removeRoute}/>
            <MapFascade allAdventures={allAdventures} selectedJourney={selectedJourney} stylingConfig={stylingConfig}/>
        </div>
    );
}

export default App;
