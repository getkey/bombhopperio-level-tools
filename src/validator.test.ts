import { validator } from './validator';
import myLevel from './levelExamples/my_level.json';

test('is an object', () => {
	expect(() => validator([])).toThrow();
	expect(() => validator(342)).toThrow();
	expect(() => validator("yo")).toThrow();
	expect(() => validator(null)).toThrow();
	expect(() => validator(undefined)).toThrow();

	// valid level
	expect(validator(myLevel)).toBe(0);
});

test('only 2 stars timings', () => {
	expect(() => validator({
		name: 'tsner',
		timings: [0],
	})).toThrow();

	expect(() => validator({
		name: 'tsner',
		timings: [1, 4, 5],
	})).toThrow();

	expect(validator({
		name: 'tsner',
		timings: [10, 2],
	})).toBe(0);
});

test('2nd star > 3rd star', () => {
	expect(() => validator({
		...myLevel,
		timings: [1, 4],
	})).toThrow();

	expect(validator({
		...myLevel,
		timings: [12345, 12345],
	})).toBe(0);
});

test('timings are ints', () => {
	expect(() => validator({
		...myLevel,
		timings: [23.12, 45],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		timings: [23, 45.021],
	})).toThrow();
});

test('timings <= 0', () => {
	expect(() => validator({
		...myLevel,
		timings: [-23, 45],
	})).toThrow();

	expect(() => validator({
		...myLevel,
		timings: [23, -45],
	})).toThrow();

	expect(validator({
		...myLevel,
		timings: [0, 0],
	})).toBe(0);
});

test('name not empty', () => {
	expect(() => validator({
		...myLevel,
		name: '',
	})).toThrow();
});

test('formatVersion is int', () => {
	expect(() => validator({
		...myLevel,
		formatVersion: 123.23,
	})).toThrow();
});
