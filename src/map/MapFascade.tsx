
import React from "react";
import MapWrapper from "./MapWrapper";
import {whanganui} from "../config/kayaks/whanganui";
import {createLineLayer, createIconLayer, createJourneyLayer} from "./LayerBuilder";
import {Journey, LocationConfig, parseConfig, parseJourneys, PathConfig} from "../config/configMapper";

interface MapFascadeProps {
    journeys: Journey[];
    stylingConfig: Map<string, PathConfig|LocationConfig>;
}

const MapFascade = (props: MapFascadeProps) => {



    const layers = [
        // createJourneyLayer(journeys[0]),
        createLineLayer([whanganui], '#ff00ff'),
        // createLineLayer([holdsworth], '#0000ff'),
        // createIconLayer([
        //     [175.034581, -40.852725], // Waikanae
        //     [174.488635, -39.770241], // Patae * 2
        //
        // ], '/images/van.png', 0.08),
        // createIconLayer([
        //     [174.91528619862862, -39.227044642807975], // John Coull
        //
        // ], '/images/hut.png', 0.08),
    ];

    return (
        <MapWrapper layers={layers}/>
    );
}

export default MapFascade;