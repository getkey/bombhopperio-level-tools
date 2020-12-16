/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Ajv from 'ajv';

import schema from './schema.json';
import { polygonIsSimple, hasEqualConsecutiveVertices, polygonArea, consecutivePointsFormEmptyTriangles, canBeDecomposed } from './utils/geom';

const ajv = new Ajv();
const validator = ajv.compile(schema);

export function validate(level: any): number {
	const valid = validator(level);

	if (!valid) throw validator.errors;

	if (level.timings[0] < level.timings[1]) {
		throw new Error('Time to get 2rd star must be higher than time to get 3rd star');
	}

	level.entities
		.map((entity: any, i: number) => ([entity, i]))
		.filter(([entity]: [any]) => entity.params.vertices)
		.forEach(([entity, i]: [any, number]) => {
			if (!polygonIsSimple(entity.params.vertices)) {
				throw new Error(`Entity ${i}: Complex polygons aren't allowed`);
			}

			if(hasEqualConsecutiveVertices(entity.params.vertices)) {
				throw new Error(`Entity ${i}: Consecutive vertices can't have the same position`);
			}

			if (!(polygonArea(entity.params.vertices) > 0)) {
				throw new Error(`Entity ${i}: Polygons areas must be > 0`);
			}

			if (consecutivePointsFormEmptyTriangles(entity.params.vertices)) {
				throw new Error(`Entity ${i}: The triangle formed by 3 consecutive points in a polygon must be of area > 0`);
			}

			if (!canBeDecomposed(entity.params.vertices)) {
				throw new Error(`Entity ${i}: Can't decompose properly`);
			}
		});

	return level.formatVersion || 0;
}
