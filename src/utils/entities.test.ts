import { getBounds, getTextBounds, centerEntities } from './entities';

describe('getBounds', () => {
	test('polygon', () => {
		expect(getBounds([{
			type: 'normal',
			params: {
				vertices: [
					{
						x: 180,
						y: 720,
					},
					{
						x: 420,
						y: 780,
					},
					{
						x: 360,
						y: 840,
					},
					{
						x: -60,
						y: 840,
					},
				],
			},
		}])).toEqual({
			top: 720,
			right: 420,
			bottom: 840,
			left: -60,
		});
	});
	test('circle', () => {
		expect(getBounds([{
			type: 'normal',
			params: {
				x: 100,
				y: -100,
				radius: 20,
			},
		}])).toEqual({
			top: -120,
			right: 120,
			bottom: -80,
			left: 80,
		});
	});
	test('text', () => {
		expect(getBounds([{
			type: 'endpoint',
			params: {
				x: 0,
				y: 0,
			},
		}])).toEqual({
			top: -80,
			right: 50,
			bottom: 80,
			left: -50,
		});
	});
	test('text', () => {
		expect(getBounds([{
			type: 'player',
			params: {
				x: 0,
				y: 0,
			},
		}])).toEqual({
			top: -20,
			right: 20,
			bottom: 20,
			left: -20,
		});
	});
	test('text', () => {
		expect(getBounds([{
			type: 'text',
			params: {
				copy: {
					en: 'aa\nbb',
				},
				x: 0,
				y: 0,
			},
		}])).toEqual({
			top: -16,
			right: 16,
			bottom: 16,
			left: -16,
		});
	});
	test('everything together', () => {
		expect(getBounds([
			{
				type: 'text',
				params: {
					copy: {
						en: 'aa\nbb',
					},
					x: 0,
					y: 0,
				},
			},
			{
				type: 'normal',
				params: {
					x: 100,
					y: -100,
					radius: 20,
				},
			},
			{
				type: 'normal',
				params: {
					vertices: [
						{
							x: 180,
							y: 720,
						},
						{
							x: 420,
							y: 780,
						},
						{
							x: 360,
							y: 840,
						},
						{
							x: -60,
							y: 840,
						},
					],
				},
			},
		])).toEqual({
			top: -120,
			right: 420,
			bottom: 840,
			left: -60,
		});
	});
});

describe('getTextBounds', () => {
	test('normal text', () => {
		expect(getTextBounds({
			type: 'text',
			params: {
				copy: {
					en: 'aa\nbb',
				},
				x: 0,
				y: 0,
			},
		})).toEqual({
			top: -16,
			right: 16,
			bottom: 16,
			left: -16,
		});
		expect(getTextBounds({
			type: 'text',
			params: {
				copy: {
					en: 'a\nb',
				},
				x: 0,
				y: 0,
			},
		})).toEqual({
			top: -16,
			right: 8,
			bottom: 16,
			left: -8,
		});
	});
	test('empty string', () => {
		expect(getTextBounds({
			type: 'text',
			params: {
				copy: {
					en: '',
				},
				x: 0,
				y: 0,
			},
		})).toEqual({
			top: -8,
			right: 8,
			bottom: 8,
			left: -8,
		});
	});
});

describe('centerEntities', () => {
	test('simple', () => {
		expect(centerEntities([
			{
				type: 'normal',
				params: {
					vertices: [
						{
							x: 100,
							y: 100,
						},
						{
							x: 100,
							y: 200,
						},
						{
							x: 200,
							y: 200,
						},
						{
							x: 200,
							y: 100,
						},
					],
				},
			},
			{
				type: 'endpoint',
				params: {
					x: 150,
					y: 150,
					isStatic: true,
					rightFacing: true,
					angle: -0.9424777960769379,
				},
			},
		])).toEqual([
			{
				type: 'normal',
				params: {
					vertices: [
						{
							x: -50,
							y: -50,
						},
						{
							x: -50,
							y: 50,
						},
						{
							x: 50,
							y: 50,
						},
						{
							x: 50,
							y: -50,
						},
					],
				},
			},
			{
				type: 'endpoint',
				params: {
					x: 0,
					y: 0,
					isStatic: true,
					rightFacing: true,
					angle: -0.9424777960769379,
				},
			},
		]);
	});
});
