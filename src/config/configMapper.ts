import fs from "fs";

export interface Location {
    name: string,
    location: number[],
}

export interface Path {
    name: string,
    reference: string,
}

export interface Journey {
    name: string;
    locations: Map<string, Location[]>;
    paths: Map<string, Path[]>;
}

export interface PathConfig {
    type: string;
    colour: string;
    width: string;
}

export interface LocationConfig {
    type: string;
    image: string;
    scale: string;
}

export const parseConfig = (configData: string): Map<string, PathConfig|LocationConfig> => {
    try {
        const configObject = JSON.parse(configData) as unknown as Map<string, any>;
        const configMap = new Map<string, PathConfig | LocationConfig>();
        Object.entries(configObject).forEach(([key, value]) => {
            if (value.type === 'path') {
                configMap.set(key, value as PathConfig);
            } else if (value.type === 'location') {
                configMap.set(key, value as LocationConfig);
            }
        });
        return configMap;
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
    return new Map<string, PathConfig | LocationConfig>();
}

export const parseJourneys = (config: Map<string, PathConfig|LocationConfig>, journeyData: string): Journey[] => {
    try {
        const journeys = JSON.parse(journeyData) as unknown as Array<{ [key: string]: any }>;
        return journeys.map(journey => {
            const name = journey["name"];
            const locations: Map<string, Location[]> = new Map<string, Location[]>();
            const paths: Map<string, Path[]> = new Map<string, Path[]>();
            Object.keys(journey).forEach(key => {
                if (config.has(key)) {
                    if (config.get(key)?.type === "path") {
                        paths.set(key, journey[key] as Path[]);
                    } else if (config.get(key)?.type === "location") {
                        locations.set(key, journey[key] as Location[]);
                    }
                }
            });
            return {name, locations, paths};
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
    return [];
}