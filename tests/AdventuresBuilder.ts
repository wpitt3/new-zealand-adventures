import {Route, Location, AllAdventures, Adventure, Coordinate} from "../src/config/adventuresDefs";

export class LocationBuilder {
    private location: Location;

    constructor() {
        this.location = { name: '', location: [] };
    }

    withName(name: string): LocationBuilder {
        this.location.name = name;
        return this;
    }

    withLocation(location: number[]): LocationBuilder {
        this.location.location = location;
        return this;
    }

    withFromDate(fromDate: string): LocationBuilder {
        this.location.fromDate = fromDate;
        return this;
    }

    withToDate(toDate: string): LocationBuilder {
        this.location.toDate = toDate;
        return this;
    }

    withDate(date: string): LocationBuilder {
        this.location.toDate = date;
        this.location.fromDate = date;
        return this;
    }

    build(): Location {
        return this.location;
    }
}

export class RouteBuilder {
    private route: Route;

    constructor() {
        this.route = { name: '', reference: '' };
    }

    withName(name: string): RouteBuilder {
        this.route.name = name;
        return this;
    }

    withReference(reference: string): RouteBuilder {
        this.route.reference = reference;
        return this;
    }

    withFromDate(fromDate: string): RouteBuilder {
        this.route.fromDate = fromDate;
        return this;
    }

    withToDate(toDate: string): RouteBuilder {
        this.route.toDate = toDate;
        return this;
    }

    withDate(date: string): RouteBuilder {
        this.route.toDate = date;
        this.route.fromDate = date;
        return this;
    }

    build(): Route {
        return this.route;
    }
}

export class AdventureBuilder {
    private adventure: Adventure;

    constructor() {
        this.adventure = {
            name: '',
            locations: {},
            routes: {}
        };
    }

    withName(name: string): AdventureBuilder {
        this.adventure.name = name;
        return this;
    }

    withFromDate(fromDate: string): AdventureBuilder {
        this.adventure.fromDate = fromDate;
        return this;
    }

    withToDate(toDate: string): AdventureBuilder {
        this.adventure.toDate = toDate;
        return this;
    }

    withDate(date: string): AdventureBuilder {
        this.adventure.toDate = date;
        this.adventure.fromDate = date;
        return this;
    }

    addLocation(key: string, location: Location): AdventureBuilder {
        if (!this.adventure.locations[key]) {
            this.adventure.locations[key] = [];
        }
        this.adventure.locations[key]!.push(location);
        return this;
    }

    addRoute(key: string, route: Route): AdventureBuilder {
        if (!this.adventure.routes[key]) {
            this.adventure.routes[key] = [];
        }
        this.adventure.routes[key]!.push(route);
        return this;
    }

    build(): Adventure {
        return this.adventure;
    }
}

export class AllAdventuresBuilder {
    private allAdventures: AllAdventures;

    constructor() {
        this.allAdventures = {
            routes: {},
            adventures: []
        };
    }

    addRoute(key: string, path: Coordinate[]): AllAdventuresBuilder {
        this.allAdventures.routes[key] = path;
        return this;
    }

    addAdventure(adventure: Adventure): AllAdventuresBuilder {
        this.allAdventures.adventures.push(adventure);
        return this;
    }

    build(): AllAdventures {
        return this.allAdventures;
    }
}
