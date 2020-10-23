import { polygonIsSimple, lineSegmentsIntersect, hasEqualConsecutiveVertices, polygonArea } from './geom';

describe('polygonIsSimple', () => {
	test('convex polygon', () => {
		expect(polygonIsSimple([
			{
				x: 180,
				y: 720,
			},
			{
				x: 420,
				y: 780,
			},
			{
				x: 360,
				y: 840,
			},
			{
				x: -60,
				y: 840,
			},
		])).toBe(true);
	});

	test('concave polygon', () => {
		expect(polygonIsSimple([
			{
				x: 180,
				y: 720,
			},
			{
				x: 420,
				y: 780,
			},
			{
				x: 360,
				y: 840,
			},
			{
				x: -60,
				y: 840,
			},
			{
				x: 240,
				y: 780,
			},
		])).toBe(true);
	});

	test('complex polygon (hourglass shapped)', () => {
		expect(polygonIsSimple([
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
		])).toBe(false);
	});

	// I would like to prevent that but I don't know how, so it's allowed
	test('hourglass shaped with a point where segments intersect', () => {
		expect(polygonIsSimple([
			{
				x: 480,
				y: 300,
			},
			{
				x: 720,
				y: 300,
			},
			{
				x: 600,
				y: 420,
			},
			{
				x: 480,
				y: 540,
			},
			{
				x: 720,
				y: 540,
			},
		])).toBe(true);
	});

	test('pincers shape with a common point', () => {
		expect(polygonIsSimple([
			{
				'x': -240,
				'y': 600,
			},
			{
				'x': 0,
				'y': 600,
			},
			{
				'x': 0,
				'y': 780,
			},
			{
				'x': -120,
				'y': 780,
			},
			{
				'x': -60,
				'y': 660,
			},
			{
				'x': -180,
				'y': 660,
			},
			{
				'x': -120,
				'y': 780,
			},
			{
				'x': -240,
				'y': 780,
			},
		])).toBe(true);
	});

	test('pincers shape with a common line segment', () => {
		expect(polygonIsSimple([
			{
				'x': -240,
				'y': 600,
			},
			{
				'x': 0,
				'y': 600,
			},
			{
				'x': 0,
				'y': 780,
			},
			{
				'x': -120,
				'y': 780,
			},
			{
				'x': -120,
				'y': 660,
			},
			{
				'x': -120,
				'y': 780,
			},
			{
				'x': -240,
				'y': 780,
			},
		])).toBe(true);
	});
});

describe('lineSegmentsIntersect', () => {
	test('intersecting lines', () => {
		expect(lineSegmentsIntersect(
			{ x: 0, y: 0},
			{ x: 1, y: 1},
			{ x: 1, y: 0},
			{ x: 0, y: 1},
		)).toBe(true);
	});

	test('point intersecting with point', () => {
		expect(lineSegmentsIntersect(
			{ x: 0, y: 0},
			{ x: 1, y: 1},
			{ x: 1, y: 1},
			{ x: 2, y: 1},
		)).toBe(false);
	});

	test('point intersecting with segment', () => {
		expect(lineSegmentsIntersect(
			{ x: 0, y: 0},
			{ x: 2, y: 2},
			{ x: 1, y: 1},
			{ x: 2, y: 1},
		)).toBe(false);
	});

	describe('not intersecting', () => {
		test('parallel', () => {
			expect(lineSegmentsIntersect(
				{ x: 0, y: 0},
				{ x: 2, y: 2},
				{ x: 0, y: 1},
				{ x: 2, y: 3},
			)).toBe(false);
		});

		test('would intersect if they were lines', () => {
			expect(lineSegmentsIntersect(
				{ x: 0, y: 0},
				{ x: 1, y: 1},
				{ x: 0, y: 3},
				{ x: 3, y: 0},
			)).toBe(false);
		});

		test('they are the same segments', () => {
			expect(lineSegmentsIntersect(
				{ x: 0, y: 0},
				{ x: 2, y: 2},
				{ x: 0, y: 0},
				{ x: 2, y: 2},
			)).toBe(false);
		});
	});
});

describe('hasEqualConsecutiveVertices', () => {
	test('no same adjacent points', () => {
		expect(hasEqualConsecutiveVertices([
			{ x: 0, y: 0},
			{ x: 1, y: 1},
			{ x: 0, y: 1},
		])).toBe(false);
	});

	describe('same adjacent points', () => {
		test('in the middle', () => {
			expect(hasEqualConsecutiveVertices([
				{ x: 0, y: 0},
				{ x: 1, y: 1},
				{ x: 1, y: 1},
				{ x: 0, y: 1},
			])).toBe(true);
		});

		test('in the top and bottom', () => {
			expect(hasEqualConsecutiveVertices([
				{ x: 0, y: 1},
				{ x: 0, y: 0},
				{ x: 1, y: 1},
				{ x: 0, y: 1},
			])).toBe(true);
		});
	});
});

describe('polygonArea', () => {
	test('simple shapes', () => {
		// all points
		expect(polygonArea([
			{ x: -5, y: 0 },
			{ x: -2, y: 0 },
			{ x: 1, y: 0 },
		])).toBe(0);

		expect(polygonArea([
			{ x: 0, y: -2 },
			{ x: 0, y: 4 },
			{ x: 0, y: -5 },
		])).toBe(0);

		expect(polygonArea([
			{ x: -1, y: 1 },
			{ x: 1, y: 1 },
			{ x: 1, y: -1 },
			{ x: -1, y: -1 },
		])).toBe(4);
	});


	test('almost complex-polygon', () => {
		expect(polygonArea([
			{ x: 0, y: 0 },
			{ x: 4, y: 3 },
			{ x: 4, y: 0 },
			{ x: 0, y: 0 },
			{ x: 2, y: 0 },
			{ x: 2, y: 0.5 },
		])).toBeCloseTo(5.5);
	});


	// test regular polygons with `n` vertices
	const radius = 100;
	for (let n = 3; n <= 12; ++n) {
		// expected area of the regular polygon
		const area = n * Math.sin(2 * Math.PI / n) * radius * radius / 2;

		// construct vertices array for the regular polygon
		const vertices = [];
		for (let i = 0; i < n; ++i) {
			// all vertices lay on the circumcircle of the polygon
			vertices.push({
				x: Math.cos(2 * Math.PI * i / n) * radius,
				y: -Math.sin(2 * Math.PI * i / n) * radius,
			});
		}
		// use `toBeCloseTo` to compare the float values
		expect(polygonArea(vertices)).toBeCloseTo(area, 6);
	}
});
