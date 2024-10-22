import {Icon, Stroke, Style} from "ol/style";
import {fromLonLat} from "ol/proj";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import VectorSource from "ol/source/Vector";
import {Vector as VectorLayer} from "ol/layer";
import Point from "ol/geom/Point";
import {Adventure, AdventureConfig, Coordinate, LocationConfig, RouteConfig} from "../config/adventuresDefs";

export class LayerBuilder {
    stylingConfig: Record<string, Style>;

    constructor(stylingConfig: AdventureConfig) {
        const sc = {} as Record<string, Style>;
        Object.entries(stylingConfig).forEach( ([key, styling]) => {
            if (styling.type === 'route') {
                sc[key] = new Style({
                    stroke: new Stroke({
                        color: (styling as RouteConfig).colour,
                        width: (styling as RouteConfig).width,
                    })
                });
            } else {
                sc[key] = new Style({
                    image: new Icon({
                        src: (styling as LocationConfig).image,
                        scale: (styling as LocationConfig).scale,
                    })
                });
            }
        })
        this.stylingConfig = sc;
    }

    createJourneyLayer(adventure: Adventure, routes: Record<string, Coordinate[]>): VectorLayer<Feature<Point | LineString>> {
        const features: Feature<Point|LineString>[] = [];

        Object.entries(adventure.routes).forEach(([key, paths]) => {
            paths.forEach(path => {
                const formattedRoute = routes[path.reference].map(it => fromLonLat([it[1], it[0]]))
                const lineFeature = new Feature({
                    geometry: new LineString(formattedRoute)
                });
                lineFeature.setStyle(this.stylingConfig[key]);
                features.push(lineFeature);
            })
        })

        Object.entries(adventure.locations).forEach(([key, locations]) => {
            locations.forEach(location => {
                const iconFeature = new Feature({
                    geometry: new Point(fromLonLat([location.location[1], location.location[0]]))
                });
                iconFeature.setStyle(this.stylingConfig[key]);
                features.push(iconFeature);
            })
        })

        return new VectorLayer({
            source: new VectorSource({features}),
        });
    }

    createJourneysLayer(routes: Record<string, Coordinate[]>): VectorLayer<Feature<Point | LineString>> {
        const features: Feature<Point | LineString>[] = [];

        Object.entries(routes).forEach(([key, paths]) => {
            const formattedRoute = routes[key].map(it => fromLonLat([it[1], it[0]]))
            const lineFeature = new Feature({
                geometry: new LineString(formattedRoute)
            });
            lineFeature.setStyle(this.stylingConfig.walks);
            features.push(lineFeature);
        })

        return new VectorLayer({
            source: new VectorSource({features}),
        });
    }
}
