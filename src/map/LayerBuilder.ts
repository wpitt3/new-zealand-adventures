import {Icon, Stroke, Style} from "ol/style";
import {fromLonLat} from "ol/proj";
import Feature from "ol/Feature";
import {LineString} from "ol/geom";
import VectorSource from "ol/source/Vector";
import {Vector as VectorLayer} from "ol/layer";
import Point from "ol/geom/Point";
import {Journey, LocationConfig, PathConfig} from "../config/configMapper";

export class LayerBuilder {
    stylingConfig: Map<string, Style>;

    constructor(stylingConfig: Map<string, PathConfig|LocationConfig>) {
        const sc = new Map<string, Style>();
        stylingConfig.forEach( (value, key) => {
            if (value.type === 'path') {
                const lineStyle = new Style({
                    stroke: new Stroke({
                        color: (value as PathConfig).colour,
                        width: (value as PathConfig).width,
                    })
                });
                sc.set(key, lineStyle)
            } else {
                const iconStyle = new Style({
                    image: new Icon({
                        src: (value as LocationConfig).image,
                        scale: (value as LocationConfig).scale,
                    })
                });
                sc.set(key, iconStyle)
            }
        })

        this.stylingConfig = sc;
    }

    createJourneyLayer(journey: Journey) {
        const features: Feature<Point|LineString>[] = [];
        journey.paths.forEach((paths, key) => {
            paths.forEach(path => {
                const formattedRoute = path.location.map(it => fromLonLat([it[1], it[0]]))
                const lineFeature = new Feature({
                    geometry: new LineString(formattedRoute)
                });
                lineFeature.setStyle(this.stylingConfig.get(key));
                features.push(lineFeature);
            })
        })

        journey.locations.forEach((locations, key) => {
            locations.forEach(location => {
                const iconFeature = new Feature({
                    geometry: new Point(fromLonLat([location.location[1], location.location[0]]))
                });
                iconFeature.setStyle(this.stylingConfig.get(key));
                features.push(iconFeature);
            })
        })

        return new VectorLayer({
            source: new VectorSource({features}),
        });
    }
}
