/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */

import Ajv, { FuncKeywordDefinition } from 'ajv';
import addFormats from 'ajv-formats';

import levelSchema from './level.schema.json';
import entitySchema from './entity.schema.json';
import prefabSchema from './prefab.schema.json';
import { polygonIsSimple, hasEqualConsecutiveVertices, polygonArea, consecutivePointsFormEmptyTriangles, canBeDecomposed } from './utils/geom';

type ValidatorFunction = FuncKeywordDefinition['validate'];

const ajv = new Ajv();
addFormats(ajv);
ajv.addSchema(entitySchema);

function polygonValidator(_: unknown, vertices: any): boolean {
	if (!polygonIsSimple(vertices)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(polygonValidator as ValidatorFunction)!.errors = [{ message: 'Complex polygons aren\'t allowed' }];
		return false;
	}

	if(hasEqualConsecutiveVertices(vertices)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(polygonValidator as ValidatorFunction)!.errors = [{ message: 'Consecutive vertices can\'t have the same position' }];
		return false;
	}

	if (!(polygonArea(vertices) > 0)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(polygonValidator as ValidatorFunction)!.errors = [{ message: 'Polygons areas must be > 0' }];
		return false;
	}

	if (consecutivePointsFormEmptyTriangles(vertices)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(polygonValidator as ValidatorFunction)!.errors = [{ message: 'The triangle formed by 3 consecutive points in a polygon must be of area > 0' }];
		return false;
	}

	if (!canBeDecomposed(vertices)) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		(polygonValidator as ValidatorFunction)!.errors = [{ message: 'Can\'t decompose properly' }];
		return false;
	}


	return true;
}

ajv.addKeyword({
	keyword: 'polygon',
	validate: polygonValidator,
});

function orderValidator(order: 'desc' | 'asc', array: Array<number>): boolean {
	switch (order) {
		case 'desc':
			return array.every((v, i, a) => i === 0 || a[i - 1] >= v);
		case 'asc':
			return array.every((v, i, a) => i === 0 || a[i - 1] <= v);
	}
}
ajv.addKeyword({
	keyword: 'order',
	validate: orderValidator,
});

const levelValidator = ajv
	.compile(levelSchema);
const prefabValidator = ajv
	.compile(prefabSchema);

export function validateLevel(level: any): number {
	const valid = levelValidator(level);

	if (!valid) throw levelValidator.errors;

	return level.formatVersion || 0;
}

export function validatePrefab(prefab: any): void {
	const valid = prefabValidator(prefab);

	if (!valid) throw prefabValidator.errors;
}
