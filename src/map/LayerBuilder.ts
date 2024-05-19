import {Icon, Stroke, Style} from "ol/style";
import {fromLonLat} from "ol/proj";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import VectorSource from "ol/source/Vector";
import {Vector as VectorLayer} from "ol/layer";
import Point from "ol/geom/Point";
import {Journey} from "../config/configMapper";

export const createJourneyLayer = (journey: Journey) => {
    const lineStyle = new Style({
        stroke: new Stroke({
            color: "#ff00ff",
            width: 2,
        })
    });

    const iconStyle = new Style({
        image: new Icon({
            src: "/images/van.png",
            scale: 0.1,
        })
    });

    const iconFeature = new Feature({
        geometry: new Point(fromLonLat([175.034581, -40.852725]))
    });
    iconFeature.setStyle(iconStyle);

    const formattedRoute = [
        fromLonLat([175.134581, -40.792725]),
        fromLonLat([175.234581, -40.752725]),
        fromLonLat([175.334581, -40.772725])
    ]
    const lineFeature = new Feature({
        geometry: new LineString(formattedRoute)
    });

    const vectorSource = new VectorSource({
        features: [iconFeature, lineFeature]
    });

    return new VectorLayer({
        source: vectorSource,
    });
}

export const createLineLayer = (routes: number[][][], colour: string) => {
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
    });
};

export const createIconLayer = (positions: number[][], iconPath: string, scale: number) => {
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
    });
};
