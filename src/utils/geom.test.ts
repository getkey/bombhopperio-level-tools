import { polygonIsSimple, lineSegmentsIntersect } from './geom';

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
