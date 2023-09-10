

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

	/** Cursor modes */
	type ToolMode = 'pan' | 'move' | 'brush' | 'scale' | 'rotate';

	/** Entity type determines how it's rendered */
	type EntityType = 'image' | 'entity' | 'text' | 'brush' | 'path';

	/** GUI Data for various control bindings to internal entities */
	interface GUIData {
		brushSize: number;
		brushColor: string;
		toolMode: ToolMode
	}

	/** Shared entity propertiess */
	type EntityBase = {
		type: EntityType
		size: Area2D;
		position: Vector2D;
		rotation: number;
		scale: Vector2D;
	}

	/** Objects that have properties to determine how they're rendered and shown in the viewport */
	interface Entity extends EntityBase {
		[key: string]: any;
		id: number;
		zIndex: number;
		selected: boolean;
		visible: boolean;
		opacity: number;
	}

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:wheel'?: (event: any) => any;
		}
	}

	/** Global properties that affect viewport renders, like selection visualizers and scale  */
	interface CanvasData {
		offset: Vector2D;
		scale: number;
		bgColor: string;
		stage: Area2D & {
			color: string
		},
		selectionOffset: number;
	}

	/** Cursor states and properties, aims to be always up to date */
	interface CursorData {
		mStartMove: Vector2D;
		mEndMove: Vector2D;
		mPosition: Vector2D;
		isDown: boolean;
	}

}

export { };
