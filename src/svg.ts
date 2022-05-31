import { escape } from 'html-escaper';

import { getBounds, getTextBounds } from './utils/entities';

const blockColors = {
	normal: 'white',
	ice: 'cyan',
	bouncy: 'orange',
	breakable: 'purple',
	deadly: 'red',
};

function verticesToSvgPoints(vertices: Array<any>): string {
	return vertices.map((vertex: any) => `${vertex.x},${vertex.y}`).join(' ');
}

export function levelToSvg(level: any): string {
	const bounds = getBounds(level.entities);
	const svgEntities = level.entities.map((entity: any) => {
		switch (entity.type) {
			case 'player': {
				return `<rect width="40" height="40" fill="yellow" x="${entity.params.x - 20}" y="${entity.params.y - 20}"/>`;
			}
			case 'endpoint': {
				return `<rect width="100" height="160" fill="green" x="${entity.params.x - 50}" y="${entity.params.y - 80}"/>`;
			}
			case 'normal':
			case 'ice':
			case 'bouncy':
			case 'deadly':
			case 'breakable': {
				const fillColor = blockColors[entity.type as keyof typeof blockColors];
				if (entity.params.radius) {
					return `<circle cx="${entity.params.x}" cy="${entity.params.y}" r="${entity.params.radius}" fill="${fillColor}"/>`;
				}

				return `<polygon points="${verticesToSvgPoints(entity.params.vertices)}" fill="${fillColor}"/>`;
			}
			case 'text': {
				const textBounds = getTextBounds(entity);
				// we are VERY careful to prevent XSS
				return `<text y="${textBounds.top}" fill="white">
		${entity.params.copy.en.split('\n')
		.map((line: string) => `<tspan x="${textBounds.left}" dy="1em">${escape(line)}</tspan>`)
		.join('\n\t\t')
}
	</text>`;
			}
			case 'paint': {
				return `<polygon points="${verticesToSvgPoints(entity.params.vertices)}" fill="#${entity.params.fillColor.toString(16).padStart(6, '0')}"/>`;
			}
		}
		return '';
	});
	return `<?xml version="1.0" standalone="no"?>
<svg viewBox="${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}" xmlns="http://www.w3.org/2000/svg">
	<defs>
		<style><![CDATA[
			@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
			text {
				font-family: 'Press Start 2P', 'Courier New', Courier, monospace, sans-serif;
				font-size: 16;
			}
		]]></style> 
	</defs>
	${svgEntities.filter((svgEntity: string) => svgEntity !== '').join('\n\t')}
</svg>`;
}
