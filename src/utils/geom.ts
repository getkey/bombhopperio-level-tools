import { makeCCW, quickDecomp } from 'poly-decomp';

type Point = {
	x: number;
	y: number;
}

// Checks if two line segments intersects.
// It's LENIENT: the points at the end of segments are allowed to intersect with segments and other points
// modified from https://github.com/schteppe/poly-decomp.js/blob/4eebc5b5780d8ffd8094615622b701e34a7835e8/src/index.js#L46 under the MIT by Stefan Hedman
// which itself probably comes from https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
export function lineSegmentsIntersect(p1: Point, p2: Point, q1: Point, q2: Point): boolean {
	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;
	const da = q2.x - q1.x;
	const db = q2.y - q1.y;

	// segments are parallel
	if ((da * dy - db * dx) === 0) {
		return false;
	}

	const s = (dx * (q1.y - p1.y) + dy * (p1.x - q1.x)) / (da * dy - db * dx);
	const t = (da * (p1.y - q1.y) + db * (q1.x - p1.x)) / (db * dx - da * dy);

	return s > 0 && s < 1 && t > 0 && t < 1;
}

export function polygonIsSimple(polygon: Array<Point>): boolean {
	const path = [
		...polygon,
		polygon[0], // close the path so the segment between the first and the last point will be checked
	];

	return path.slice(0, -1).every((pointA, i) => {
		const pointB = path[i + 1];

		return path.slice(0, i - 1).every((pointC, j) => {
			const pointD = path[j + 1];

			return !lineSegmentsIntersect(pointA, pointB, pointC, pointD);
		});
	});
}

export function hasEqualConsecutiveVertices(polygon: Array<Point>): boolean {
	const closed = [
		...polygon,
		polygon[0], // close the path so the segment between the first and the last point will be checked
	];

	return closed.slice(0, -1).some((pointA, i) => {
		const pointB = closed[i + 1];

		return pointA.x === pointB.x && pointA.y === pointB.y;
	});
}

// courtesy of https://github.com/getkey/ble/blob/master/src/utils/geom.ts#L29-L36
export function polygonArea(vertices: Array<Point>): number {
	let area = 0;
	for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
		area += (vertices[i].x + vertices[j].x) * (vertices[j].y - vertices[i].y);
	}
	// area can be negative if the vertices are not ordered counter-clockwise
	return Math.abs(area / 2);
}

export function consecutivePointsFormEmptyTriangles(polygon: Array<Point>): boolean {
	if (polygon.length <= 2) return false;

	const closed = [
		...polygon,
		polygon[0], // close the path so the segment between the first and the last point will be checked
		polygon[1], // close the path so the segment between the first and the last point will be checked
	];

	return closed.slice(0, -2).some((pointA, i) => {
		const pointB = closed[i + 1];
		const pointC = closed[i + 2]

		return polygonArea([
			pointA,
			pointB,
			pointC
		]) === 0;
	});
}

// see https://github.com/liabru/matter-js/blob/master/src/factory/Bodies.js#L256-L261
export function canBeDecomposed(polygon: Array<Point>): boolean {
	const vertices: Array<[number, number]> = polygon.map(({ x, y }) => [x, y]);
	makeCCW(vertices);
	const decomp = quickDecomp(vertices);

	return decomp.length >= 1;
}
