import { validator } from './validator';
import myLevel from './levelExamples/my_level.json';

test('is an object', () => {
	expect(() => validator([])).toThrow();
	expect(() => validator(342)).toThrow();
	expect(() => validator('yo')).toThrow();
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

test('entities always and only have type and params', () => {
	expect(validator({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					isStatic: false,
					vertices: [
						{ x: 1223123, y: 1234567 },
						{ x: 1223, y: 8493249 },
						{ x: 23123, y: 932749 },
					]
				}
			}
		],
	})).toEqual(0);

	expect(() => validator({
		...myLevel,
		entities: [
			{
				params: {
					isStatic: false,
					vertices: [
						{ x: 1223123, y: 1234567 },
						{ x: 1223, y: 8493249 },
						{ x: 23123, y: 932749 },
					]
				}
			}
		],
	})).toThrow();

	expect(validator({
		...myLevel,
		entities: [
			{
				type: 'text',
				params: {
					x: 500,
					y: 300,
					copy: {
						en: 'This is the default level!\nEdit it to your liking.',
						fr: 'Voici le niveau par défaut\nÉdite comme il te plait.',
					},
					anchor: {
						x: 0.5,
						y: 0.5,
					},
				},
			},
		],
	})).toEqual(0);

	['text', 'normal', 'bouncy', 'breakable'].forEach((type) => {
		expect(() => validator({
			...myLevel,
			entities: [
				{
					type,
				},
			],
		})).toThrow();
	});
});

test('x, y, copy and anchor are required', () => {
	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'text',
				params: {
					y: 300,
					copy: {
						en: 'This is the default level!\nEdit it to your liking.',
					},
					anchor: {
						x: 0.5,
						y: 0.5,
					},
				},
			},
		],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'text',
				params: {
					x: 500,
					copy: {
						en: 'This is the default level!\nEdit it to your liking.',
					},
					anchor: {
						x: 0.5,
						y: 0.5,
					},
				},
			},
		],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'text',
				params: {
					x: 500,
					y: 300,
					anchor: {
						x: 0.5,
						y: 0.5,
					},
				},
			},
		],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'text',
				params: {
					x: 500,
					y: 300,
					copy: {
						en: 'This is the default level!\nEdit it to your liking.',
					},
				},
			},
		],
	})).toThrow();
});

test('text can have anything as a language code', () => {
	expect(validator({
		...myLevel,
		entities: [
			{
				type: 'text',
				params: {
					x: 500,
					y: 300,
					copy: {
						en: 'This is the default level!\nEdit it to your liking.',
						langaugeCodeThatDoesntExist: 'bleh',
					},
					anchor: {
						x: 0.5,
						y: 0.5,
					},
				},
			},
		],
	})).toEqual(0);
});

test('text needs english', () => {
	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'text',
				params: {
					x: 500,
					y: 300,
					copy: {
						it: 'pizza',
						de: 'Wurst',
					},
					anchor: {
						x: 0.5,
						y: 0.5,
					},
				},
			},
		],
	})).toThrow();
});

test('x, y, isStatic and angle are required in endpoint', () => {
	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					y: 360,
					isStatic: true,
					rightFacing: true,
					angle: 0,
				}
			},
		],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					isStatic: true,
					rightFacing: true,
					angle: 0,
				}
			},
		],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					y: 360,
					rightFacing: true,
					angle: 0,
				}
			},
		],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					y: 360,
					isStatic: true,
					rightFacing: true,
				}
			},
		],
	})).toThrow();
});


test('rightFacing is optional in endpoint', () => {
	expect(validator({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					y: 360,
					isStatic: true,
					rightFacing: false,
					angle: 0,
				}
			},
		],
	})).toEqual(0);

	expect(validator({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					y: 360,
					isStatic: true,
					angle: 0,
				}
			},
		],
	})).toEqual(0);
});
