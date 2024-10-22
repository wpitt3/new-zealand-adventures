export interface Coordinate3D {
    x: number;  // longitude
    y: number;  // latitude
    z: number;  // elevation
}

export interface Coordinate2D {
    x: number;  // longitude
    y: number;  // latitude
    name: string;
}

export interface RouteData {
    name: string;
    trackPoints: Coordinate3D[];
    waypoints: Coordinate2D[];
}

export enum FileFormat {
    GPX = 'gpx',
    KML = 'kml',
    CSV = 'csv'
}

abstract class BaseRouteParser {
    protected original: string;

    constructor(original: string) {
        this.original = original
    }

    abstract parse(): RouteData;

    protected parseFloatAttribute(element: Element, attributeName: string): number | null {
        const value = element.getAttribute(attributeName);
        return value ? parseFloat(value) : null;
    }

    protected parseFloatContent(element: Element | null): number | null {
        if (!element?.textContent) return null;
        const parsed = parseFloat(element.textContent);
        return isNaN(parsed) ? null : parsed;
    }
}

abstract class XMLRouteParser extends BaseRouteParser {
    protected xmlDoc: Document;

    constructor(xmlString: string) {
        super(xmlString)
        const parser = new DOMParser();
        this.xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        const parserError = this.xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }
    }

    abstract parse(): RouteData;
}

class GPXParser extends XMLRouteParser {
    parse(): RouteData {
        return {
            name: this.parseMetadataName(),
            trackPoints: this.parseTrackPoints(),
            waypoints: this.parseWaypoints(),
        };
    }

    private parseMetadataName(): string {
        return this.xmlDoc.querySelector('metadata > name')?.textContent?.trim() || '';
    }

    private parseTrackPoints(): Coordinate3D[] {
        const trackPoints: Coordinate3D[] = [];
        const trkptElements = this.xmlDoc.querySelectorAll('trkpt');

        trkptElements.forEach((trkpt) => {
            const lat = this.parseFloatAttribute(trkpt, 'lat');
            const lon = this.parseFloatAttribute(trkpt, 'lon');
            const ele = this.parseFloatContent(trkpt.querySelector('ele'));

            if (lat !== null && lon !== null && ele !== null) {
                trackPoints.push({ x: lon, y: lat, z: ele });
            }
        });

        return trackPoints;
    }

    private parseWaypoints(): Coordinate2D[] {
        const waypoints: Coordinate2D[] = [];
        const wptElements = this.xmlDoc.querySelectorAll('wpt');

        wptElements.forEach((wpt) => {
            const lat = this.parseFloatAttribute(wpt, 'lat');
            const lon = this.parseFloatAttribute(wpt, 'lon');
            const name = wpt.querySelector('name')?.textContent?.trim() || '';

            if (lat !== null && lon !== null) {
                waypoints.push({ x: lon, y: lat, name });
            }
        });

        return waypoints;
    }
}

class KMLParser extends XMLRouteParser {
    parse(): RouteData {
        return {
            name: this.parseDocumentName(),
            trackPoints: this.parseTrackPoints(),
            waypoints: this.parseWaypoints(),
        };
    }

    private parseDocumentName(): string {
        return this.xmlDoc.querySelector('Document > name')?.textContent?.trim() || '';
    }

    private parseTrackPoints(): Coordinate3D[] {
        const trackPoints: Coordinate3D[] = [];
        const lineStrings = this.xmlDoc.querySelectorAll('Placemark > MultiGeometry > LineString > coordinates, Placemark > LineString > coordinates');

        lineStrings.forEach((lineString) => {
            const coordinates = lineString.textContent?.trim().split('\n') || [];

            coordinates.forEach((coord) => {
                const [lon, lat, ele] = coord.trim().split(',').map(Number);

                if (!isNaN(lon) && !isNaN(lat) && !isNaN(ele)) {
                    trackPoints.push({ x: lon, y: lat, z: ele });
                }
            });
        });

        return trackPoints;
    }

    private parseWaypoints(): Coordinate2D[] {
        const waypoints: Coordinate2D[] = [];
        const placemarks = this.xmlDoc.querySelectorAll('Placemark');

        placemarks.forEach((placemark) => {
            const point = placemark.querySelector('Point > coordinates');
            if (!point) return;

            const name = placemark.querySelector('name')?.textContent?.trim() || '';
            const [lon, lat] = point.textContent?.trim().split(',').map(Number) || [];

            if (!isNaN(lon) && !isNaN(lat)) {
                waypoints.push({ x: lon, y: lat, name });
            }
        });

        return waypoints;
    }
}

class CSVParser extends BaseRouteParser {
    parse(): RouteData {
        return {
            name: "",
            trackPoints: this.parseTrackPoints(),
            waypoints: [],
        };
    }

    private parseTrackPoints(): Coordinate3D[] {
        const trackPoints: Coordinate3D[] = [];

        const lines = this.original
            .trim()
            .split('\n')
            .filter(line => line.trim().length > 0);

        if (lines.length === 0) {
            return trackPoints;
        }

        const firstLine = lines[0];
        const startIndex = this.isHeaderLine(firstLine) ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            const point = this.parseCSVLine(line);
            if (point) {
                trackPoints.push(point);
            }
        }
        return trackPoints;
    }

    private isHeaderLine(line: string): boolean {
        const values = line.split(',');
        // Check if any value in the line can be converted to a valid number
        return !values.some(value => !isNaN(parseFloat(value.trim())));
    }

    private parseCSVLine(line: string): Coordinate3D | null {
        // Split the line and trim each value
        const values = line.split(',').map(v => v.trim());

        // Ensure we have exactly 3 values
        if (values.length !== 3) {
            return null;
        }

        // Parse values to numbers
        const lat = parseFloat(values[0]);
        const lon = parseFloat(values[1]);
        const ele = parseFloat(values[2]);

        // Validate all values are numbers
        if (isNaN(lat) || isNaN(lon) || isNaN(ele)) {
            return null;
        }

        // Return coordinate with longitude as x, latitude as y
        return {
            x: lon, // Longitude is x
            y: lat, // Latitude is y
            z: ele  // Elevation is z
        };
    }
}

export class RouteParser {
    static parse(xmlString: string): RouteData {
        // Detect format based on root element
        const format = xmlString.includes('<gpx') ? FileFormat.GPX : (xmlString.includes('<kml') ? FileFormat.KML : FileFormat.CSV);

        switch (format) {
            case FileFormat.GPX:
                return new GPXParser(xmlString).parse();
            case FileFormat.KML:
                return new KMLParser(xmlString).parse();
            case FileFormat.CSV:
                return new CSVParser(xmlString).parse();
            default:
                throw new Error('Unsupported file format');
        }
    }
}
