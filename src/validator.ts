/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Ajv from 'ajv';

import levelSchema from './level.schema.json';
import entitySchema from './entity.schema.json';
import prefabSchema from './prefab.schema.json';
import { polygonIsSimple, hasEqualConsecutiveVertices, polygonArea, consecutivePointsFormEmptyTriangles, canBeDecomposed } from './utils/geom';

const ajv = new Ajv();
ajv.addSchema(entitySchema);

const levelValidator = ajv
	.compile(levelSchema);
const prefabValidator = ajv
	.compile(prefabSchema);

function validateEntities(entities: any): void {
	// replace this by user-defined keywords https://ajv.js.org/docs/validation.html#user-defined-keywords
	entities
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
}

export function validateLevel(level: any): number {
	const valid = levelValidator(level);

	if (!valid) throw levelValidator.errors;

	if (level.timings[0] < level.timings[1]) {
		throw new Error('Time to get 2rd star must be higher than time to get 3rd star');
	}

	validateEntities(level.entities);

	return level.formatVersion || 0;
}

export function validatePrefab(prefab: any): void {
	const valid = prefabValidator(prefab);

	if (!valid) throw prefabValidator.errors;

	validateEntities(prefab);
}
