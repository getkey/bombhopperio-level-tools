import { round } from './utils/math';

interface Point {
	x: number;
	y: number;
}

function optimizePoint(point: Point, digits: number): void {
	point.x = round(point.x, digits);
	point.y = round(point.y, digits);
}

function optimizeParams(params: any, digits = 0): void {
	if ('x' in params && 'y' in params) {
		optimizePoint(params, digits);
	}

	if ('vertices' in params) {
		params.vertices.forEach((vertex: Point) => optimizePoint(vertex, digits));
	}
}

export function optimizeLevel(level: any): void {
	level.entities.forEach((entity: any) => optimizeParams(entity.params));

	return level;
}
