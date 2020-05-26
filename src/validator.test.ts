import { validator } from './validator';
import myLevel from './my_level.json';

test('basic valid level', () => {
	expect(validator(myLevel)).toBe(true);
});
