import { AnySchemaObject } from 'ajv';
import { DataValidationCxt } from 'ajv/dist/types';

import { round } from './utils/math';
import { createLevelValidator } from './validator';

interface Point {
	x: number;
	y: number;
}

function optimizePoint(point: Point, digits: number): void {
	point.x = round(point.x, digits);
	point.y = round(point.y, digits);
}

function optimizeEntity(entity: any): void {
	optimizeGeometry(entity.params);

	if ('opacity' in entity.params) {
		entity.params.opacity = round(entity.params.opacity, 2);
	}
}

function optimizeGeometry(params: any, digits = 3): void {
	if ('x' in params && 'y' in params) {
		optimizePoint(params, digits);
	}

	if ('radius' in params) {
		params.radius = round(params.radius, digits);
	}

	if ('vertices' in params) {
		params.vertices.forEach((vertex: Point) => optimizePoint(vertex, digits));
	}
}

export function optimizeLevel(level: any): any {
	level.entities.forEach((entity: any) => optimizeEntity(entity));

	const levelValidator = createLevelValidator();
	levelValidator(level);

	return level;
}
