import {AdventureConfig} from "../src/config/adventuresDefs";

export class AdventureConfigBuilder {
    private config: AdventureConfig = {};

    addRouteConfig(key: string, colour: string, width: number): this {
        this.config[key] = {
            type: 'route',
            colour,
            width
        };
        return this;
    }

    addLocationConfig(key: string, image: string, scale: number): this {
        this.config[key] = {
            type: 'location',
            image,
            scale
        };
        return this;
    }

    build(): AdventureConfig {
        return this.config;
    }
}