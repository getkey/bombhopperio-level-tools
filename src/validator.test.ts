import { validate } from './validator';
import myLevel from './levelExamples/test_level_for_the_validator_tool.json';

test('is an object', () => {
	expect(() => validate([])).toThrow();
	expect(() => validate(342)).toThrow();
	expect(() => validate('yo')).toThrow();
	expect(() => validate(null)).toThrow();
	expect(() => validate(undefined)).toThrow();

	// valid level
	expect(validate(myLevel)).toBe(0);
});

test('only 2 stars timings', () => {
	expect(() => validate({
		name: 'tsner',
		timings: [0],
		entities: [],
	})).toThrow();

	expect(() => validate({
		name: 'tsner',
		timings: [1, 4, 5],
		entities: [],
	})).toThrow();

	expect(validate({
		name: 'tsner',
		timings: [10, 2],
		entities: [],
	})).toBe(0);
});

test('2nd star > 3rd star', () => {
	expect(() => validate({
		...myLevel,
		timings: [1, 4],
	})).toThrow();

	expect(validate({
		...myLevel,
		timings: [12345, 12345],
	})).toBe(0);
});

test('timings are ints', () => {
	expect(() => validate({
		...myLevel,
		timings: [23.12, 45],
	})).toThrow();

	expect(() => validate({
		...myLevel,
		timings: [23, 45.021],
	})).toThrow();
});

test('timings <= 0', () => {
	expect(() => validate({
		...myLevel,
		timings: [-23, 45],
	})).toThrow();

	expect(() => validate({
		...myLevel,
		timings: [23, -45],
	})).toThrow();

	expect(validate({
		...myLevel,
		timings: [0, 0],
	})).toBe(0);
});

test('name not empty', () => {
	expect(() => validate({
		...myLevel,
		name: '',
	})).toThrow();
});

test('formatVersion is int', () => {
	expect(() => validate({
		...myLevel,
		formatVersion: 123.23,
	})).toThrow();
});

test('empty entities', () => {
	expect(validate({
		...myLevel,
		entities: [],
	})).toBe(0);
});

test('entity has to be in the proper format', () => {
	[null, undefined, 1232132123.432432432, [], {}, 'estaioneariots'].forEach((trash) => {
		expect(() => validate({
			...myLevel,
			entities: [trash],
		})).toThrow();
	});

});

['normal', 'ice', 'bouncy', 'breakable', 'deadly'].forEach((blockType) => {
	test(`${blockType} works`, () => {
		expect(validate({
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
						],
					},
				},
			],
		})).toBe(0);
	});

	test(`${blockType} should have at least 2 vertices`, () => {
		expect(() => validate({
			...myLevel,
			entities: [
				{
					type: blockType,
					params: {
						isStatic: false,
						vertices: [
							{ x: 1223123, y: 84932749 },
							{ x: 23123, y: 932749 },
						],
					},
				},
			],
		})).toThrow();
	});

	test(`${blockType} should have at least 2 vertices`, () => {
		expect(() => validate({
			...myLevel,
			entities: [
				{
					type: blockType,
					params: {
						isStatic: false,
						vertices: [
							{ x: 1223123, y: 84932749 },
							{ x: 23123, y: 932749 },
						],
					},
				},
			],
		})).toThrow();
	});
});

test('type is always required', () => {
	expect(() => validate({
		...myLevel,
		entities: [
			{
				params: {
					isStatic: false,
					vertices: [
						{ x: 1223123, y: 84932749 },
						{ x: 1289803123, y: 84932749 },
						{ x: 23123, y: 932749 },
					],
				},
			},
		],
	})).toThrow();
});

test('params is always required', () => {
	expect(() => validate({
		...myLevel,
		entities: [
			{
				type: 'normal',
			},
		],
	})).toThrow();
});

test('vertices is always required for blocks', () => {
	expect(() => validate({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					isStatic: false,
				},
			},
		],
	})).toThrow();
});

test('isStatic is optional for blocks', () => {
	expect(validate({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					vertices: [
						{ x: 1223123, y: 84932749 },
						{ x: 1289803123, y: 84932749 },
						{ x: 23123, y: 932749 },
					],
				},
			},
		],
	})).toBe(0);
});

test('vertices can have x, y and that\'s it', () => {
	expect(() => validate({
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
					],
				},
			},
		],
	})).toThrow();

	expect(() => validate({
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
					],
				},
			},
		],
	})).toThrow();
});

test('entities always and only have type and params', () => {
	expect(validate({
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
					],
				},
			},
		],
	})).toEqual(0);

	expect(() => validate({
		...myLevel,
		entities: [
			{
				params: {
					isStatic: false,
					vertices: [
						{ x: 1223123, y: 1234567 },
						{ x: 1223, y: 8493249 },
						{ x: 23123, y: 932749 },
					],
				},
			},
		],
	})).toThrow();

	expect(validate({
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
		expect(() => validate({
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
	expect(() => validate({
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

	expect(() => validate({
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

	expect(() => validate({
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

	expect(() => validate({
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
	expect(validate({
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
	expect(() => validate({
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
	expect(() => validate({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					y: 360,
					isStatic: true,
					rightFacing: true,
					angle: 0,
				},
			},
		],
	})).toThrow();

	expect(() => validate({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					isStatic: true,
					rightFacing: true,
					angle: 0,
				},
			},
		],
	})).toThrow();

	expect(() => validate({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					y: 360,
					rightFacing: true,
					angle: 0,
				},
			},
		],
	})).toThrow();

	expect(() => validate({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					y: 360,
					isStatic: true,
					rightFacing: true,
				},
			},
		],
	})).toThrow();
});


test('rightFacing is optional in endpoint', () => {
	expect(validate({
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
				},
			},
		],
	})).toEqual(0);

	expect(validate({
		...myLevel,
		entities: [
			{
				type: 'endpoint',
				params: {
					x: 900,
					y: 360,
					isStatic: true,
					angle: 0,
				},
			},
		],
	})).toEqual(0);
});

test('complex polygons are rejected', () => {
	expect(() => validate({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					isStatic: true,
					vertices: [
						{
							x: -240,
							y: 600,
						},
						{
							x: 0,
							y: 600,
						},
						{
							x: -240,
							y: 840,
						},
						{
							x: 0,
							y: 840,
						},
					],
				},
			},
		],
	})).toThrow('Complex polygons aren\'t allowed');
});

test('polygons with equal adjacent points are rejected', () => {
	expect(() => validate({
		...myLevel,
		entities: [
			{
				type: 'normal',
				params: {
					isStatic: true,
					vertices: [
						{
							x: -240,
							y: 300,
						},
						{
							x: -300,
							y: 300,
						},
						{
							x: -300,
							y: 300,
						},
						{
							x: -300,
							y: 240,
						},
					],
				},
			},
		],
	})).toThrow('Consecutive vertices can\'t have the same position');
});

describe('polygons with 0 area are rejected', () => {
	['normal', 'deadly', 'breakable', 'bouncy', 'ice'].forEach((type) => {
		test(type, () => {
			expect(() => validate({
				...myLevel,
				entities: [
					{
						type,
						params: {
							isStatic: true,
							vertices: [
								{
									x: 0,
									y: 0,
								},
								{
									x: 1,
									y: 0,
								},
								{
									x: 0,
									y: 0,
								},
								{
									x: 1,
									y: 0,
								},
							],
						},
					},
				],
			})).toThrow('Polygons areas must be > 0');
		});
	});
	test('paint', () => {
		expect(() => validate({
			...myLevel,
			entities: [
				{
					type: 'paint',
					params: {
						vertices: [
							{
								x: 0,
								y: 0,
							},
							{
								x: 1,
								y: 0,
							},
							{
								x: 0,
								y: 0,
							},
							{
								x: 1,
								y: 0,
							},
						],
						fillColor: 0x00000,
					},
				},
			],
		})).toThrow('Polygons areas must be > 0');
	});
});

describe('weird non-simple polygon that doesn\'t decompose properly', () => {
	['normal', 'deadly', 'breakable', 'bouncy', 'ice'].forEach((type) => {
		test(type, () => {
			expect(() => validate({
				...myLevel,
				entities: [
					{
						type,
						params: {
							isStatic: true,
							vertices: [
								{
									'x': 120,
									'y': 720,
								},
								{
									'x': 300,
									'y': 720,
								},
								{
									'x': 120,
									'y': 600,
								},
								{
									'x': 180,
									'y': 660,
								},
								{
									'x': 300,
									'y': 720,
								},
								{
									'x': 60,
									'y': 480,
								},
								{
									'x': 120,
									'y': 660,
								},
							],
						},
					},
				],
			})).toThrow('Can\'t decompose properly');
		});
	});

	test('paint', () => {
		expect(() => validate({
			...myLevel,
			entities: [
				{
					type: 'paint',
					params: {
						vertices: [
							{
								'x': 120,
								'y': 720,
							},
							{
								'x': 300,
								'y': 720,
							},
							{
								'x': 120,
								'y': 600,
							},
							{
								'x': 180,
								'y': 660,
							},
							{
								'x': 300,
								'y': 720,
							},
							{
								'x': 60,
								'y': 480,
							},
							{
								'x': 120,
								'y': 660,
							},
						],
						fillColor: 0xffffff,
					},
				},
			],
		})).toThrow('Can\'t decompose properly');
	});
});

describe('paint works', () => {
	test('floating fillColor', () => {
		expect(() => validate({
			...myLevel,
			entities: [
				{
					type: 'paint',
					params: {
						vertices: [
							{
								'x': 120,
								'y': 720,
							},
							{
								'x': 300,
								'y': 720,
							},
							{
								'x': 120,
								'y': 600,
							},
						],
						fillColor: 0.5,
					},
				},
			],
		})).toThrow();
	});
	test('negative fillColor', () => {
		expect(() => validate({
			...myLevel,
			entities: [
				{
					type: 'paint',
					params: {
						vertices: [
							{
								'x': 120,
								'y': 720,
							},
							{
								'x': 300,
								'y': 720,
							},
							{
								'x': 120,
								'y': 600,
							},
						],
						fillColor: -1,
					},
				},
			],
		})).toThrow();
	});
	test('too big fillColor', () => {
		expect(() => validate({
			...myLevel,
			entities: [
				{
					type: 'paint',
					params: {
						vertices: [
							{
								'x': 120,
								'y': 720,
							},
							{
								'x': 300,
								'y': 720,
							},
							{
								'x': 120,
								'y': 600,
							},
						],
						fillColor: 9999999999,
					},
				},
			],
		})).toThrow();
	});
	test('correct', () => {
		expect(validate({
			...myLevel,
			entities: [
				{
					type: 'paint',
					params: {
						vertices: [
							{
								'x': 120,
								'y': 720,
							},
							{
								'x': 300,
								'y': 720,
							},
							{
								'x': 120,
								'y': 600,
							},
						],
						fillColor: 0x123456,
					},
				},
			],
		})).toBe(0);
	});
});
