import Ajv from 'ajv';

import schema from './schema.json';

const ajv = new Ajv();
const validator = ajv.compile(schema);

export function validate(level: any) {
	const valid = validator(level);

	if (!valid) throw validator.errors;

	if (level.timings[0] < level.timings[1]) {
		throw new Error('Time to get 2rd star must be higher than time to get 3rd star');
	}

	return level.formatVersion || 0;
}
