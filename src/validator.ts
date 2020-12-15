/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Ajv from 'ajv';
import { makeCCW, quickDecomp } from 'poly-decomp';

import schema from './schema.json';
import { polygonIsSimple, hasEqualConsecutiveVertices, polygonArea, consecutivePointsFormEmptyTriangles } from './utils/geom';

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

			// make sure the polygon will decompose properly
			// see https://github.com/liabru/matter-js/blob/master/src/factory/Bodies.js#L256-L261
			const vertices = entity.params.vertices.map(({ x, y }: { x: number, y: number }) => [x, y]);
			makeCCW(vertices);
			const decomp = quickDecomp(vertices);

			if (decomp.length < 1) {
				throw new Error(`Entity ${i}: Can't decompose properly`);
			}
		});

	return level.formatVersion || 0;
}
