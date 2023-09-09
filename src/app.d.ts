

// See https://kit.svelte.dev/docs/types#app

import type { SvelteComponent, ComponentType } from "svelte";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	/** Two dimensional area */
	interface Area2D {
		width: number;
		height: number;
	}

	/** Three dimensional area */
	interface Area3D extends Area2D {
		length: number;
	}

	/** Point in two dimensional space */
	interface Vector2D {
		x: number;
		y: number;
	}

	/** Point in three dimensional space */
	interface Vector3D extends Vector2D {
		z: number;
	}

	/** DOM node reference and spatial details */
	interface CanvasDetails {
		node: HTMLCanvasElement?;
		size: Area2D;
	}

	/** Recursive optional properties */
	type DeepPartial<T> = {
		[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
	}


	type ToolMode = 'pan' | 'move' | 'brush' | 'scale' | 'rotate';

	/** GUI Data for various control bindings to internal entities */
	interface GUIData {
		brushSize: number;
		brushColor: string;
		toolMode: ToolMode
	}

	interface Entity {
		id: number;
		type: string;
		zIndex: number;
		selected: boolean;
		visible: boolean;
		draw?: (() => void) | null;
	}

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:mousewheel'?: (event: any) => any;
		}
	}

	type DeltaMap = {
		start: number;
		last: number;
		span: number;
	}

	interface Frame {
		delta: DeltaMap;
		ordinal: number;
	}

	type CursorModeState = {
		path: string;
		element: HTMLImageElement?;
	}

	type CursorMode = {
		[key in ToolMode]: {
			up: CursorModeState
			down: CursorModeState
		}
	}

	interface CursorData {
		mStartMove: Vector2D;
		mEndMove: Vector2D;
		mPosition: Vector2D;
		isDown: boolean;
		modes: CursorMode
	}

}

export { };
