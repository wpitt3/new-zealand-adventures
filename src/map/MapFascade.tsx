
import React, {useEffect, useState} from "react";
import MapWrapper from "./MapWrapper";
import {LayerBuilder} from "./LayerBuilder";
import {Vector as VectorLayer} from "ol/layer";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import Point from "ol/geom/Point";
import {AdventureConfig, AllAdventures} from "../config/adventuresDefs";

interface MapFascadeProps {
    allAdventures: AllAdventures;
    stylingConfig: AdventureConfig;
    selectedJourney: number;
}

const MapFascade = (props: MapFascadeProps) => {
    const [layers, setLayers] = useState<VectorLayer<Feature<Point | LineString>>[]>([]);

    useEffect(() => {
        const layerBuilder = new LayerBuilder(props.stylingConfig)
        setLayers(props.allAdventures.adventures.map(adventure => layerBuilder.createJourneyLayer(adventure, props.allAdventures.routes)));
    }, [props.stylingConfig, props.allAdventures.adventures]);

    if (props.selectedJourney !== null && !!layers) {
        if (props.selectedJourney === -1) {
            layers.forEach((layer) => layer.setVisible(true))
        } else {
            layers.forEach((layer, i) => layer.setVisible(i === props.selectedJourney) )
        }
    }

    return (
        <MapWrapper layers={layers} viewExtent={props.selectedJourney !== -1 ? layers[props.selectedJourney].getSource()?.getExtent() : undefined}/>
    );
}

export default MapFascade;