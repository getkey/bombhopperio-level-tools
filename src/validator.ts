import Ajv from 'ajv';

import schema from './schema.json';

const ajv = new Ajv();

var validate = ajv.compile(schema);

export function validator(level: any) {
	const valid = validate(level);

	if (!valid) throw validate.errors;

	if (level.timings[0] < level.timings[1]) {
		throw new Error('Time to get 2rd star must be higher than time to get 3rd star');
	}

	return true;
}
