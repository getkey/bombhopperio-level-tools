export function getBounds(entities: Array<any>): { top: number; right: number; bottom: number; left: number; } {
	return entities.flatMap((entity) => {
		if (entity.type === 'text') {
			const { top, right, bottom, left } = getTextBounds(entity);

			return [
				{
					x: left,
					y: top,
				},
				{
					x: right,
					y: bottom,
				},
			];
		}
		if (entity.type === 'endpoint') {
			// TODO: take angle into account
			return [
				{
					x: entity.params.x - 50,
					y: entity.params.x - 80,
				},
				{
					x: entity.params.x + 50,
					y: entity.params.x + 80,
				},
			];
		}
		if (entity.type === 'player') {
			// TODO: take angle into account
			return [
				{
					x: entity.params.x - 20,
					y: entity.params.x - 20,
				},
				{
					x: entity.params.x + 20,
					y: entity.params.x + 20,
				},
			];
		}

		if ('vertices' in entity.params) {
			return entity.params.vertices;
		}

		if ('x' in entity.params && 'y' in entity.params && 'radius' in entity.params) {
			return [
				{
					x: entity.params.x + entity.params.radius,
					y: entity.params.y + entity.params.radius,
				},
				{
					x: entity.params.x - entity.params.radius,
					y: entity.params.y - entity.params.radius,
				},
			];
		}

		return [];
	}).reduce((acc, point) => ({
		top: Math.min(point.y, acc.top),
		right: Math.max(point.x, acc.right),
		bottom: Math.max(point.y, acc.bottom),
		left: Math.min(point.x, acc.left),
	}), {
		top: Infinity,
		right: -Infinity,
		bottom: -Infinity,
		left: Infinity,
	});
}

export function getTextBounds(textEntity: any): { top: number; right: number; bottom: number; left: number; } {
	// TODO: take the anchor into account
	const splitted = (textEntity.params.copy.en as string).split('\n');
	const rows = Math.max(1, splitted.length);
	const cols = Math.max(1, splitted.reduce((acc, line) => Math.max(acc, line.length), 0));

	const width = cols * 16;
	const height = rows * 16;

	return {
		top: textEntity.params.y - height/2,
		right: textEntity.params.x + width/2,
		bottom: textEntity.params.y + height/2,
		left: textEntity.params.x - width/2,
	};
}

export function centerEntities(entities: Array<any>, { x, y } = { x: 0, y: 0 }): Array<any> {
	const { top, right, bottom, left } = getBounds(entities);
	const center = {
		x: left + (right - left)/2,
		y: top + (bottom - top)/2,
	};

	return entities.map((entity) => {
		if ('vertices' in entity.params) {
			return {
				...entity,
				params: {
					...entity.params,
					vertices: entity.params.vertices.map((vertex: any) => ({
						x: vertex.x - center.x + x,
						y: vertex.y - center.y + y,
					})),
				},
			};
		}

		if ('x' in entity.params && 'y' in entity.params) {
			return {
				...entity,
				params: {
					...entity.params,
					x: entity.params.x - center.x + x,
					y: entity.params.y - center.y + y,
				},
			};
		}
		return entity;
	});
}
