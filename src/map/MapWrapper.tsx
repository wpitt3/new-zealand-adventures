import React, {useEffect, useState} from "react";
import Map from "ol/Map";
import 'ol/ol.css';
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import {Vector as VectorLayer} from "ol/layer";
import Point from "ol/geom/Point";
import {Extent} from "ol/extent";
import "./Map.css"

interface MapWrapperProps {
    layers: VectorLayer<Feature<Point | LineString>>[];
    viewExtent?: Extent
}

const initialLocation = [-3.3371829, 51.5963272];

const MapWrapper = (props: MapWrapperProps) => {
    const padding = 100;

    const [oMap, setMap] = useState<Map | null>(null);

    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat(initialLocation),
                zoom: 6
            })
        });
        setMap(map);

        return () => {
            map.dispose();
        };
    }, []);

    useEffect(() => {
        if (props.layers && !!oMap) {
            oMap.setLayers([
                new TileLayer({
                    source: new OSM()
                }),
                ...props.layers]
            )
        }
    }, [oMap, props.layers]);

    useEffect(() => {
        if (props.viewExtent && !!oMap) {
            oMap.getView().fit(props.viewExtent, { duration: 1000, padding:[padding, padding, padding, padding], maxZoom: 14})

        }
        if (!props.viewExtent && !!oMap) {
            const point = new Point(fromLonLat(initialLocation));
            oMap.getView().fit(point, { duration: 2000, padding:[padding, padding, padding, padding], maxZoom: 7})
        }
    }, [oMap, props.viewExtent]);



    return <div className="map-container" id="map"></div>;
};

export default MapWrapper;