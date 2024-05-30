import {parseJourneys, Journey, Location, Path, parseConfig, PathConfig, LocationConfig} from './configMapper';

describe('parseConfig', () => {
    it('should parse config data correctly', () => {
        const configData = JSON.stringify({
            path1: { type: 'path', colour: '#0000ff', width: 2},
            location1: { type: 'location', image: 'marker.png', scale: 0.5 }
        });

        const expectedResult: Map<string, PathConfig | LocationConfig> = new Map([
            ['path1', { type: 'path', colour: '#0000ff', width: 2}],
            ['location1', { type: 'location', image: 'marker.png', scale: 0.5 }]
        ]);

        const result: Map<string, PathConfig | LocationConfig> = parseConfig(configData);

        expect(result).toEqual(expectedResult);
    });

    it('should handle empty input', () => {
        const configData = '';
        expect(parseConfig(configData)).toEqual(new Map());
    });

    it('should handle invalid JSON', () => {
        const configData = 'invalid json';
        expect(parseConfig(configData)).toEqual(new Map());
    });
});

describe('parseJourneys', () => {
    const config = new Map();
    config.set('location1', {type: 'location', image: 'mark.png', scale: 0.01})
    config.set('path1', {type: 'path', colour: '#0000ff', width: 1})

    // it('should parse journey data correctly', () => {
    //     const journeyData = JSON.stringify([
    //         {
    //             name: 'Journey 1',
    //             location1: [{ name: 'Location A', location: [1, 2] }],
    //             path1: [{ name: 'Path A', reference: 'A1' }]
    //         }
    //     ]);
    //     const expectedResult: Journey[] = [
    //         {
    //             name: 'Journey 1',
    //             locations: new Map<string, Location[]>([['location1', [{ name: 'Location A', location: [1, 2] }]]]),
    //             paths: new Map<string, Path[]>([['path1', [{ name: 'Path A', reference: 'A1' }]]])
    //         }
    //     ];
    //
    //     const result = parseJourneys(config, journeyData);
    //
    //     expect(result).toEqual(expectedResult);
    // });
    //
    // it('handle missing journey data', () => {
    //     const journeyData = JSON.stringify([
    //         {
    //             name: 'Journey 1',
    //             location1: [{ name: 'Location A', location: [1, 2] }],
    //             path1: [{ name: 'Path A', reference: 'A1' }]
    //         }
    //     ]);
    //     const expectedResult: Journey[] = [
    //         {
    //             name: 'Journey 1',
    //             locations: new Map<string, Location[]>([['location1', [{ name: 'Location A', location: [1, 2] }]]]),
    //             paths: new Map<string, Path[]>([['path1', [{ name: 'Path A', reference: 'A1' }]]])
    //         }
    //     ];
    //
    //     const result = parseJourneys(config, journeyData);
    //
    //     expect(result).toEqual(expectedResult);
    // });

    it('should handle empty input', async () => {
        const journeyData = '';
        expect(await parseJourneys(config, journeyData)).toEqual([]);
    });

    it('should handle invalid JSON', async () => {
        const journeyData = 'invalid json';
        expect(await parseJourneys(config, journeyData)).toEqual([]);
    });
});