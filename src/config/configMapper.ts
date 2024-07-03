import {AdventureConfig, AllAdventures, Route, RouteConfig} from "./adventuresDefs";

export const parseConfig = (configData: string): AdventureConfig => {
    const config = JSON.parse(configData) as AdventureConfig;

    const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

    Object.values(config).forEach( (c) => {
        if (c.type === 'route' && !hexRegex.test((c as RouteConfig).colour)) {
            throw Error('Invalid route colour ' + (c as RouteConfig).colour)
        }
    })
    return config;
}

export const parseAdventures = (config: AdventureConfig, adventuresJson: string): AllAdventures =>  {
    const allAdventures = JSON.parse(adventuresJson) as AllAdventures;

    allAdventures.adventures.forEach( adventure => {
        adventure.locations = {...adventure.locations}
        adventure.routes = {...adventure.routes}

        Object.keys(adventure.locations).forEach( (locationKey ) => {
            if (!config[locationKey] || config[locationKey]?.type !== 'location') {
                throw Error('Invalid location type ' + locationKey)
            }
        });

        Object.keys(adventure.routes).forEach((routeKey) => {
            if (!config[routeKey] || config[routeKey]?.type !== 'route') {
                throw Error('Invalid route type ' + routeKey)
            }
        });

        Object.values(adventure.routes).forEach((routes: Route[]) => {
            routes.forEach(route => {
                if (!allAdventures.routes[route.reference]) {
                    throw Error('Missing route ' + route.reference)
                }
            });
        });
    });
    return allAdventures ;
}

export async function readFile(filePath: string): Promise<string> {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${filePath}`);
    }
    return response.text();
}