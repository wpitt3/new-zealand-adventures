
export interface Location {
    name: string,
    location: number[],
}

interface PathFromFile {
    name: string,
    reference: string,
}

export interface Path {
    name: string,
    location: number[][]
}

export interface Journey {
    name: string;
    locations: Map<string, Location[]>;
    paths: Map<string, Path[]>;
}

export interface PathConfig {
    type: string;
    colour: string;
    width: number;
}

export interface LocationConfig {
    type: string;
    image: string;
    scale: number;
}

async function readPathFile(filePath: string): Promise<number[][]> {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${filePath}`);
    }
    const responseText = await response.text();

    return responseText.split("\n").slice(1).filter(it => !!it).map(it => it.split(',').map(n => +n))
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

export const parseJourneys = async (config: Map<string, PathConfig|LocationConfig>, journeyData: string): Promise<Journey[]> => {
    try {
        const journeys = JSON.parse(journeyData) as unknown as Array<{ [key: string]: any }>;

        const pathsMap = new Map();

        const pathFiles: string[] = journeys.flatMap(journey => Object.keys(journey).flatMap(key => {
            if (config.has(key) && config.get(key)?.type === "path") {
                return (journey[key] as PathFromFile[]).map( it => {
                    return "./config/"+key+"/"+ it.reference +".csv"
                })
            }
            return []
        })).filter(it => !!it)
        for (const pathFile of pathFiles) {
            if (!pathsMap.has(pathFile)) {
                pathsMap.set(pathFile, await readPathFile(pathFile));
            }
        }

        return journeys.map(journey => {
            const name = journey["name"];
            const locations: Map<string, Location[]> = new Map<string, Location[]>();
            const paths: Map<string, Path[]> = new Map<string, Path[]>();
            Object.keys(journey).forEach(key => {
                if (config.has(key)) {
                    if (config.get(key)?.type === "path") {
                        paths.set(key, (journey[key] as PathFromFile[]).map( it => {
                            const location = pathsMap.get("./config/"+key+"/"+ it.reference +".csv");
                            return {name: it.name, location} as Path
                        }))
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