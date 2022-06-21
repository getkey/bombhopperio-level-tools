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

function opacityAttribute(opacity: number) {
	if (opacity === 1 || opacity === undefined) {
		return '';
	}
	return ` opacity="${opacity}"`;
}

export function levelToSvg(level: any): string {
	const bounds = getBounds(level.entities);
	const svgEntities = level.entities.map((entity: any) => {
		switch (entity.type) {
			case 'player': {
				return `<use href="#hoppi" x="${entity.params.x}" y="${entity.params.y}"/>`;
			}
			case 'endpoint': {
				return `<use href="#door" x="${entity.params.x}" y="${entity.params.y}"/>`;
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
				return `<text y="${textBounds.top}" fill="${entity.params.fillColor !== undefined ? `#${entity.params.fillColor.toString(16)}` : 'white'}"${opacityAttribute(entity.params.opacity)}>
		${entity.params.copy.en.split('\n')
		.map((line: string) => `<tspan x="${textBounds.left}" dy="1em">${escape(line)}</tspan>`)
		.join('\n\t\t')
}
	</text>`;
			}
			case 'paint': {
				return `<polygon points="${verticesToSvgPoints(entity.params.vertices)}" fill="#${entity.params.fillColor.toString(16).padStart(6, '0')}"${opacityAttribute(entity.params.opacity)}/>`;
			}
		}
		return '';
	});
	return `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.left} ${bounds.top} ${bounds.right - bounds.left} ${bounds.bottom - bounds.top}" preserveAspectRatio="xMidYMid meet">
	<defs>
		<g id="hoppi">
			<rect width="38" height="38" x="-19" y="-19" fill="#757a2b" stroke="#ffff14" stroke-width="2"/>
			<rect width="3" height="10" x="-3" y="-9" fill="white"/>
			<rect width="3" height="6" x="7" y="-6" fill="white"/>
			<rect width="3" height="3" x="2" y="7" fill="white"/>
		</g>
		<g id="door" stroke="#7dff63" stroke-width="2">
			<rect width="98" height="158" x="-49" y="-79" fill="green"/>
			<polyline points="49,-79 19,-64 19,64 49,79" fill="none"/>
			<line x1="28" y1="11" x2="28" y2="21" />
		</g>
		<style><![CDATA[
			@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
			text {
				font-family: 'Press Start 2P', 'Courier New', Courier, monospace, sans-serif;
				font-size: 16;
			}
		]]></style> 
	</defs>
	${svgEntities.filter((svgEntity: string) => svgEntity !== '').join('\n\t')}
</svg>
`;
}
