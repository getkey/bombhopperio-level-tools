import { round } from './math';

describe('round', () => {
	[
		[Infinity, 10.23456789],
		[5, 10.23457],
		[0, 10],
		[1, 10.2],
	].forEach(([digits, result]) => {
		test(`round to ${digits} digits`, () => {
			expect(round(10.23456789, digits)).toBe(result);
		});
	});
	expect(round(3599.9999999999986, 3)).toBe(3600);
});
