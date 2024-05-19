import React, {useEffect, useState} from "react";
import Map from "ol/Map";
import 'ol/ol.css';
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import {fromLonLat} from "ol/proj";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import VectorSource from "ol/source/Vector";
import {Vector as VectorLayer} from "ol/layer";
import Point from "ol/geom/Point";

interface MapWrapperProps {
    layers: VectorLayer<VectorSource<Feature<LineString | Point>>>[];
    // view: center, lat, long,
}

const MapWrapper = (props: MapWrapperProps) => {
    const [oMap, setMap] = useState<Map | null>(null);

    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                ...props.layers,
            ],
            view: new View({
                center: fromLonLat([174.885971, -40.900557]),
                zoom: 6
            })
        });
        setMap(map);

        return () => {
            map.dispose();
        };
    }, []);

    // if (props.update != -1 && !!oMap) {
    //     oMap.getLayers().getArray()[props.update+1].setVisible(false);
    // }

    // oMap?.setView()

    return <div id="map" style={{ width: '100%', height: '100vh' }}></div>;
};

export default MapWrapper;