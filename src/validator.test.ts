import { validateLevel } from './validator';
import myLevel from './levelExamples/test_level_for_the_validator_tool.json';

test('is an object', () => {
	expect(() => validateLevel([])).toThrow();
	expect(() => validateLevel(342)).toThrow();
	expect(() => validateLevel('yo')).toThrow();
	expect(() => validateLevel(null)).toThrow();
	expect(() => validateLevel(undefined)).toThrow();

	// valid level
	expect(validateLevel(myLevel)).toBe(0);
});

test('only 2 stars timings', () => {
	expect(() => validateLevel({
		name: 'tsner',
		timings: [0],
		entities: [],
	})).toThrow();

	expect(() => validateLevel({
		name: 'tsner',
		timings: [1, 4, 5],
		entities: [],
	})).toThrow();

	expect(validateLevel({
		name: 'tsner',
		timings: [10, 2],
		entities: [],
	})).toBe(0);
});

test('2nd star > 3rd star', () => {
	expect(() => validateLevel({
		...myLevel,
		timings: [1, 4],
	})).toThrow();

	expect(validateLevel({
		...myLevel,
		timings: [12345, 12345],
	})).toBe(0);
});

test('timings are ints', () => {
	expect(() => validateLevel({
		...myLevel,
		timings: [23.12, 45],
	})).toThrow();

	expect(() => validateLevel({
		...myLevel,
		timings: [23, 45.021],
	})).toThrow();
});

test('timings <= 0', () => {
	expect(() => validateLevel({
		...myLevel,
		timings: [-23, 45],
	})).toThrow();

	expect(() => validateLevel({
		...myLevel,
		timings: [23, -45],
	})).toThrow();

	expect(validateLevel({
		...myLevel,
		timings: [0, 0],
	})).toBe(0);
});

test('name not empty', () => {
	expect(() => validateLevel({
		...myLevel,
		name: '',
	})).toThrow();
});

test('formatVersion is int', () => {
	expect(() => validateLevel({
		...myLevel,
		formatVersion: 123.23,
	})).toThrow();
});

test('empty entities', () => {
	expect(validateLevel({
		...myLevel,
		entities: [],
	})).toBe(0);
});

test('entity has to be in the proper format', () => {
	[null, undefined, 1232132123.432432432, [], {}, 'estaioneariots'].forEach((trash) => {
		expect(() => validateLevel({
			...myLevel,
			entities: [trash],
		})).toThrow();
	});

});

['normal', 'ice', 'bouncy', 'breakable', 'deadly'].forEach((blockType) => {
	test(`${blockType} works`, () => {
		expect(validateLevel({
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
		expect(() => validateLevel({
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
		expect(() => validateLevel({
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
	expect(() => validateLevel({
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
	expect(() => validateLevel({
		...myLevel,
		entities: [
			{
				type: 'normal',
			},
		],
	})).toThrow();
});

test('vertices is always required for blocks', () => {
	expect(() => validateLevel({
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
	expect(validateLevel({
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
	expect(() => validateLevel({
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

	expect(() => validateLevel({
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
	expect(validateLevel({
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

	expect(() => validateLevel({
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

	expect(validateLevel({
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
		expect(() => validateLevel({
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
	expect(() => validateLevel({
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

	expect(() => validateLevel({
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

	expect(() => validateLevel({
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

	expect(() => validateLevel({
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
	expect(validateLevel({
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
	expect(() => validateLevel({
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

describe('endpoint', () => {
	test('x, y, isStatic and angle are required in endpoint', () => {
		expect(() => validateLevel({
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

		expect(() => validateLevel({
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

		expect(() => validateLevel({
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

		expect(() => validateLevel({
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
		expect(validateLevel({
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

		expect(validateLevel({
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


	test('destination is a uuid v4', () => {
		expect(validateLevel({
			...myLevel,
			entities: [
				{
					type: 'endpoint',
					params: {
						x: 900,
						y: 360,
						isStatic: true,
						angle: 0,
						destination: 'b3cd72ad-e47c-4aac-a720-3ea871d0330c',
					},
				},
			],
		})).toEqual(0);

		expect(() => validateLevel({
			...myLevel,
			entities: [
				{
					type: 'endpoint',
					params: {
						x: 900,
						y: 360,
						isStatic: true,
						angle: 0,
						destination: 'noob',
					},
				},
			],
		})).toThrow();
	});
});

test('complex polygons are rejected', () => {
	expect(() => validateLevel({
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
	})).toThrow();
});

test('polygons with equal adjacent points are rejected', () => {
	expect(() => validateLevel({
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
	})).toThrow();
});

describe('polygons with 0 area are rejected', () => {
	['normal', 'deadly', 'breakable', 'bouncy', 'ice'].forEach((type) => {
		test(type, () => {
			expect(() => validateLevel({
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
			})).toThrow();
		});
	});
	test('paint', () => {
		expect(() => validateLevel({
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
		})).toThrow();
	});
});

describe('weird non-simple polygon that doesn\'t decompose properly', () => {
	['normal', 'deadly', 'breakable', 'bouncy', 'ice'].forEach((type) => {
		test(type, () => {
			expect(() => validateLevel({
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
			})).toThrow();
		});
	});

	test('paint', () => {
		expect(() => validateLevel({
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
		})).toThrow();
	});
});

describe('paint works', () => {
	test('floating fillColor', () => {
		expect(() => validateLevel({
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
		expect(() => validateLevel({
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
		expect(() => validateLevel({
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
		expect(validateLevel({
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
