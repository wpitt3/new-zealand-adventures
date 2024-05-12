// MapComponent.tsx

import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Icon, Stroke, Style} from 'ol/style';
import {LineString} from "ol/geom";
import {whanganui} from "./kayaks/whanganui";
import {holdsworth} from "./walks/holdsworth";

const MapComponent: React.FC = () => {
    const [lineLayerVisible, setLineLayerVisible] = useState(true);
    const [iconLayersVisible, setIconLayersVisible] = useState(true);

    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                createLineLayer([whanganui], '#ff00ff'),
                createLineLayer([holdsworth], '#0000ff'),
                createIconLayer([
                    [175.034581, -40.852725], // Waikanae
                    [174.488635, -39.770241], // Patae * 2

                ], '/images/van.png', 0.08),
                createIconLayer([
                    [174.91528619862862, -39.227044642807975], // John Coull

                ], '/images/hut.png', 0.08),
            ],
            view: new View({
                center: fromLonLat([174.885971, -40.900557]),
                zoom: 8
            })
        });

        return () => {
            map.dispose();
        };
    }, []);

    const createLineLayer = (routes: number[][][], colour: string) => {
        const lineStyle = new Style({
            stroke: new Stroke({
                color: colour, // Red color
                width: 2,
            })
        });

        const routesAsLines = routes.map( route => {
            const formattedRoute = route.map ( point => fromLonLat([point[1], point[0]]))
            const lineFeature = new Feature({
                geometry: new LineString(formattedRoute)
            });
            lineFeature.setStyle(lineStyle);
            return lineFeature;
        })

        const vectorSource = new VectorSource({
            features: routesAsLines
        });

        return new VectorLayer({
            source: vectorSource,
            visible: lineLayerVisible
        });
    };

    const createIconLayer = (positions: number[][], iconPath: string, scale: number) => {
        const iconStyle = new Style({
            image: new Icon({
                src: iconPath,
                scale
            })
        });

        const icons = positions.map(position => {
            const iconFeature = new Feature({
                geometry: new Point(fromLonLat(position))
            });
            iconFeature.setStyle(iconStyle);
            return iconFeature;
        })

        const vectorSource = new VectorSource({
            features: icons
        });

        return new VectorLayer({
            source: vectorSource,
            visible: iconLayersVisible
        });
    };

    const toggleLayerVisibility = (layerIndex: number) => {
        if (layerIndex === 0) {
            setLineLayerVisible(!lineLayerVisible);
        } else {
            // Index 1 corresponds to the first icon layer
            setIconLayersVisible(!iconLayersVisible);
        }
    };

    return <div id="map" style={{ width: '100%', height: '100vh' }}></div>;
};

export default MapComponent;
