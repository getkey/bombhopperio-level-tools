type Vertex = [number, number];
type Polygon = Array<Vertex>;

declare module 'poly-decomp' {
	export function makeCCW(vertices: Polygon): Polygon;
	export function quickDecomp(vertices: Polygon): Array<Polygon>;
}
