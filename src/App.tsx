import React, {useEffect, useState} from 'react';
import './App.css';
import MapFascade from "./map/MapFascade";
import {readFile, parseState} from "./config/configMapper";
import {AdventureConfig, AllAdventures, Coordinate} from "./config/adventuresDefs";
import AdventureSidebar from "./AdventureSidebar";
import {RouteParser} from "./RouteParser";
import { styled } from '@mui/material/styles';
import {
    Box,
    Drawer,
    IconButton,
    Typography,
    useTheme,
} from '@mui/material';
import {
    ExpandLess as ExpandLessIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import ElevationProfile from "./ElevationProfile";

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


    const LEFT_DRAWER_WIDTH = 280;
    const BOTTOM_DRAWER_HEIGHT = 320;

    const BottomDrawer = styled(Box)(({ theme }) => ({
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: LEFT_DRAWER_WIDTH,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: theme.zIndex.drawer - 1,
    }));

    const Main = styled('main')(() => ({
        flexGrow: 1,
    }));

    const theme = useTheme();
    const [bottomOpen, setBottomOpen] = useState(true);
    const [selectedRoute, selectRoute] = useState("");

    return (
        <div className="App" >
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: LEFT_DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: LEFT_DRAWER_WIDTH,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <AdventureSidebar allAdventures={allAdventures} downloadState={downloadState} uploadState={uploadState} addRoute={addRoute} removeRoute={removeRoute} selectedRoute={selectedRoute} selectRoute={selectRoute}/>
            </Drawer>

            <Main>
                <Box>
                    <MapFascade allAdventures={allAdventures} selectedJourney={selectedJourney} stylingConfig={stylingConfig}/>
                </Box>
                <BottomDrawer
                    sx={{
                        height: bottomOpen ? BOTTOM_DRAWER_HEIGHT : 0,
                        transition: theme.transitions.create('height', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                    }}
                >
                    {bottomOpen && !!allAdventures.routes && !!allAdventures.routes[selectedRoute] && (
                        <ElevationProfile coordinates={allAdventures.routes[selectedRoute]}/>
                    )}
                </BottomDrawer>
            </Main>
        </div>
    );
}

export default App;
