import { round } from './utils/math';

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

	if (entity.params.isStatic === false) {
		delete entity.params.isStatic;
	}

	if ('opacity' in entity.params) {
		if (entity.params.opacity === 1) {
			delete entity.params.opacity;
		} else {
			entity.params.opacity = round(entity.params.opacity, 2);
		}
	}

	switch (entity.type) {
		case 'endpoint': {
			if (entity.params.rightFacing === false) {
				delete entity.params.rightFacing;
			}
			break;
		}
		case 'paint': {
			if (entity.params.fillColor === 0xffffff) {
				delete entity.params.fillColor;
			}
			break;
		}
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

	return level;
}
