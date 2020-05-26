import { validator } from './validator';
import myLevel from './levelExamples/my_level.json';

test('is an object', () => {
	expect(() => validator([])).toThrow();
	expect(() => validator(342)).toThrow();
	expect(() => validator("yo")).toThrow();
	expect(() => validator(null)).toThrow();
	expect(() => validator(undefined)).toThrow();

	// valid level
	expect(validator(myLevel)).toBe(0);
});

test('only 2 stars timings', () => {
	expect(() => validator({
		name: 'tsner',
		timings: [0],
	})).toThrow();

	expect(() => validator({
		name: 'tsner',
		timings: [1, 4, 5],
	})).toThrow();

	expect(validator({
		name: 'tsner',
		timings: [10, 2],
	})).toBe(0);
});

test('2nd star > 3rd star', () => {
	expect(() => validator({
		...myLevel,
		timings: [1, 4],
	})).toThrow();

	expect(validator({
		...myLevel,
		timings: [12345, 12345],
	})).toBe(0);
});

test('timings are ints', () => {
	expect(() => validator({
		...myLevel,
		timings: [23.12, 45],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		timings: [23, 45.021],
	})).toThrow();
});

test('timings <= 0', () => {
	expect(() => validator({
		...myLevel,
		timings: [-23, 45],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		timings: [23, -45],
	})).toThrow();

	expect(validator({
		...myLevel,
		timings: [0, 0],
	})).toBe(0);
});

test('name not empty', () => {
	expect(() => validator({
		...myLevel,
		name: '',
	})).toThrow();
});

test('formatVersion is int', () => {
	expect(() => validator({
		...myLevel,
		formatVersion: 123.23,
	})).toThrow();
});

test('empty entities', () => {
	expect(validator({
		...myLevel,
		entities: [],
	})).toBe(0);
});

test('entity has to be in the proper format', () => {
	[null, undefined, 1232132123.432432432, [], {}, 'estaioneariots'].forEach((trash) => {
		expect(() => validator({
			...myLevel,
			entities: [trash],
		})).toThrow();
	});

});

['normal', 'ice', 'bouncy', 'breakable'].forEach((blockType) => {
	test(`${blockType} works`, () => {
		expect(validator({
			...myLevel,
			entities: [
				{
					type: blockType,
					params: {
						isStatic: false,
						vertices: [
							{ x: 1223123, y: 84932749 },
							{ x: 1223, y: 8493249 },
							{ x: 23123, y: 932749 },
						]
					}
				}
			],
		})).toBe(0);
	});

	test(`${blockType} should have at least 2 vertices`, () => {
		expect(() => validator({
			...myLevel,
			entities: [
				{
					type: blockType,
					params: {
						isStatic: false,
						vertices: [
							{ x: 1223123, y: 84932749 },
							{ x: 23123, y: 932749 },
						]
					}
				}
			],
		})).toThrow();
	});

	test(`${blockType} should have at least 2 vertices`, () => {
		expect(() => validator({
			...myLevel,
			entities: [
				{
					type: blockType,
					params: {
						isStatic: false,
						vertices: [
							{ x: 1223123, y: 84932749 },
							{ x: 23123, y: 932749 },
						]
					}
				}
			],
		})).toThrow();
	});
});

test('type is always required', () => {
	expect(() => validator({
		...myLevel,
		entities: [
			{
				params: {
					isStatic: false,
					vertices: [
						{ x: 1223123, y: 84932749 },
						{ x: 1289803123, y: 84932749 },
						{ x: 23123, y: 932749 },
					]
				}
			}
		],
	})).toThrow();
});

test('params is always required', () => {
	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'normal',
			}
		],
	})).toThrow();
});

test('vertices is always required for blocks', () => {
	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					isStatic: false,
				}
			}
		],
	})).toThrow();
});

test('isStatic is optional for blocks', () => {
	expect(validator({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					vertices: [
						{ x: 1223123, y: 84932749 },
						{ x: 1289803123, y: 84932749 },
						{ x: 23123, y: 932749 },
					]
				}
			}
		],
	})).toBe(0);
});

test('vertices can have x, y and that\'s it', () => {
	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					isStatic: false,
					vertices: [
						{ x: 1223123, y: 84932749, crap: true },
						{ x: 1223, y: 8493249 },
						{ x: 23123, y: 932749 },
					]
				}
			}
		],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					isStatic: false,
					vertices: [
						{ x: 1223123 },
						{ x: 1223, y: 8493249 },
						{ x: 23123, y: 932749 },
					]
				}
			}
		],
	})).toThrow();
});
