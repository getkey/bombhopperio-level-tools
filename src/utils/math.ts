export function round(float: number, numbersAfterComma = 0): number {
	const pow = Math.pow(10, numbersAfterComma);
	return Math.round(float * pow) / pow;
}
