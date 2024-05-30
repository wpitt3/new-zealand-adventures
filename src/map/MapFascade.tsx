
import React, {useEffect, useState} from "react";
import MapWrapper from "./MapWrapper";
import {LayerBuilder} from "./LayerBuilder";
import {Journey, LocationConfig,PathConfig} from "../config/configMapper";
import VectorSource from "ol/source/Vector";
import {Vector as VectorLayer} from "ol/layer";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import Point from "ol/geom/Point";

interface MapFascadeProps {
    journeys: Journey[];
    stylingConfig: Map<string, PathConfig|LocationConfig>;
    selectedJourney: number;
}

const MapFascade = (props: MapFascadeProps) => {
    const [layers, setLayers] = useState<VectorLayer<VectorSource<Feature<LineString | Point>>>[]>([]);

    useEffect(() => {
        const layerBuilder = new LayerBuilder(props.stylingConfig)
        setLayers(props.journeys.map(journey => layerBuilder.createJourneyLayer(journey)));
    }, [props.stylingConfig, props.journeys]);

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