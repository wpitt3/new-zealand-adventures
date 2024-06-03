import {AdventureBuilder, AllAdventuresBuilder, LocationBuilder, RouteBuilder} from "./AdventuresBuilder";
import {parseAdventures, parseConfig} from "../src/config/combinedConfigMapper";
import {AdventureConfigBuilder} from "./AdventuresConfigBuilder";
import {AdventureConfig} from "../src/config/adventuresDefs";


describe('parseConfig', () => {
    it('should parse config data correctly', () => {
        const adventureConfig = new AdventureConfigBuilder()
            .addLocationConfig('huts', 'mark.png', 0.01)
            .addRouteConfig('walks', '#0000ff', 1)
            .build()

        const result: AdventureConfig = parseConfig(JSON.stringify(adventureConfig));

        expect(Object.keys(result)).toHaveLength(2)
        expect(Object.keys(result.huts)).toHaveLength(3)
        expect(Object.keys(result.walks)).toHaveLength(3)
        expect(result).toEqual(adventureConfig);
    });

    it('should throw on empty input', () => {
        const configData = '';
        expect(() => {
            parseConfig(configData);
        }).toThrow();
    });

    it('should throw on invalid JSON', () => {
        const configData = 'invalid json';
        expect(() => {
            parseConfig(configData);
        }).toThrow();
    });

    it('should throw on invalid colour', () => {
        const adventureConfig = new AdventureConfigBuilder()
            .addRouteConfig('walks', '#000ff', 1)
            .build()
        expect(() => {
            parseConfig(JSON.stringify(adventureConfig));
        }).toThrow();
    });

    it('should handle 3 value colour', () => {
        const adventureConfig = new AdventureConfigBuilder()
            .addRouteConfig('walks', '#fff', 1)
            .build()
        expect(() => {
            parseConfig(JSON.stringify(adventureConfig));
        }).not.toThrow();
    });

    it.skip('invalid image', () => {

    })

    it.skip('invalid width', () => {

    })

    it.skip('invalid scale', () => {

    })
});

describe('parseAdventuress', () => {
    const config = new AdventureConfigBuilder()
        .addLocationConfig('huts', 'mark.png', 0.01)
        .addRouteConfig('walks', '#0000ff', 1)
        .build()

    const camp1 = new LocationBuilder()
        .withName('Catch Pool')
        .withLocation([-41.35082416484304, 174.92574414769334])
        .withFromDate('2022-01-01')
        .withToDate('2022-01-10')
        .build();

    const camp2 = new LocationBuilder()
        .withName('National Park')
        .withLocation([-39.17603429971191, 175.3937284210923])
        .build();

    const tongariroAlpineCrossing = new RouteBuilder()
        .withName('Tongariro Alpine Crossing')
        .withReference('tongariro_alpine_crossing')
        .withFromDate('2022-01-01')
        .build();

    it('should correctly build and parse an AllAdventures object', () => {

        const adventure1 = new AdventureBuilder()
            .withName('Adventure 1')
            .withFromDate('2022-01-01')
            .withToDate('2022-01-15')
            .addLocation('huts', camp1)
            .addLocation('huts', camp2)
            .addRoute('walks', tongariroAlpineCrossing)
            .build();

        const allAdventures = new AllAdventuresBuilder()
            .addRoute('tongariro_alpine_crossing', [[1, 2, 3], [3, 4, 5]])
            .addAdventure(adventure1)
            .build();

        const parsedAdventures = parseAdventures(config, JSON.stringify(allAdventures));

        expect(Object.keys(parsedAdventures.routes)).toHaveLength(1)
        expect(Object.keys(parsedAdventures.adventures)).toHaveLength(1)
        expect(parsedAdventures.adventures[0].locations['huts']).toHaveLength(2)
        expect(parsedAdventures.adventures[0].routes['walks']).toHaveLength(1)
        expect(parsedAdventures).toEqual(allAdventures);
    });

    it('should error if routes references do not match', () => {
        const adventure1 = new AdventureBuilder()
            .withName('Adventure 1')
            .addRoute('walks', tongariroAlpineCrossing)
            .build();

        const allAdventures = new AllAdventuresBuilder()
            .addAdventure(adventure1)
            .build();

        expect(() => {
            parseAdventures(config, JSON.stringify(allAdventures));
        }).toThrow('Missing route ' + tongariroAlpineCrossing.reference);
    });

    it('should error if route type is not in config', () => {
        const adventure1 = new AdventureBuilder()
            .withName('Adventure 1')
            .addRoute('cycle', tongariroAlpineCrossing)
            .build();

        const allAdventures = new AllAdventuresBuilder()
            .addRoute('tongariro_alpine_crossing', [[1, 2, 3], [3, 4, 5]])
            .addAdventure(adventure1)
            .build();

        expect(() => {
            parseAdventures(config, JSON.stringify(allAdventures));
        }).toThrow('Invalid route type ' + Object.keys(adventure1.routes)[0]);
    });

    it('should error if location type is not in config', () => {
        const adventure1 = new AdventureBuilder()
            .withName('Adventure 1')
            .addLocation('camp', camp1)
            .build();

        const allAdventures = new AllAdventuresBuilder()
            .addAdventure(adventure1)
            .build();

        const jsonString = JSON.stringify(allAdventures);

        expect(() => {
            parseAdventures(config, jsonString);
        }).toThrow('Invalid location type ' + Object.keys(adventure1.locations)[0]);
    });

    it('should error on empty input', async () => {
        const journeyData = '';
        expect(() => {
            parseAdventures(config, journeyData);
        }).toThrow();
    });

    it('should error on  invalid JSON', async () => {
        const journeyData = 'invalid json';
        expect(() => {
            parseAdventures(config, journeyData);
        }).toThrow();
    });
});