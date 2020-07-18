/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Ajv from 'ajv';

import schema from './schema.json';
import { polygonIsSimple } from './utils/geom';

const ajv = new Ajv();
const validator = ajv.compile(schema);

export function validate(level: any): number {
	const valid = validator(level);

	if (!valid) throw validator.errors;

	if (level.timings[0] < level.timings[1]) {
		throw new Error('Time to get 2rd star must be higher than time to get 3rd star');
	}

	const hasComplexPolygons = level.entities.some((entity: any) => entity.params.vertices && !polygonIsSimple(entity.params.vertices));

	if (hasComplexPolygons) {
		throw new Error('Complex polygons aren\'t allowed.');
	}

	return level.formatVersion || 0;
}
