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
import {Extent} from "ol/extent";
import "./Map.css"

interface MapWrapperProps {
    layers: VectorLayer<VectorSource<Feature<LineString | Point>>>[];
    viewExtent?: Extent
}

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
                center: fromLonLat([174.885971, -40.900557]),
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
    }, [props.layers]);

    useEffect(() => {
        if (props.viewExtent && !!oMap) {
            oMap.getView().fit(props.viewExtent, { duration: 1000, padding:[padding, padding, padding, padding], maxZoom: 14})

        }
        if (!props.viewExtent && !!oMap) {
            let point = new Point(fromLonLat([174.885971, -40.900557]));
            oMap.getView().fit(point, { duration: 1000, padding:[padding, padding, padding, padding], maxZoom: 6})
        }
    }, [props.viewExtent]);



    return <div className="map-container" id="map"></div>;
};

export default MapWrapper;