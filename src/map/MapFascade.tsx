
import React from "react";
import MapWrapper from "./MapWrapper";
import {LayerBuilder} from "./LayerBuilder";
import {Journey, LocationConfig,PathConfig} from "../config/configMapper";

interface MapFascadeProps {
    journeys: Journey[];
    stylingConfig: Map<string, PathConfig|LocationConfig>;
}

const MapFascade = (props: MapFascadeProps) => {
    const layerBuilder = new LayerBuilder(props.stylingConfig)
    const layers = props.journeys.map(journey => layerBuilder.createJourneyLayer(journey));

    return (
        <MapWrapper layers={layers}/>
    );
}

export default MapFascade;