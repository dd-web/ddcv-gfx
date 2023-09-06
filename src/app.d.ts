

// See https://kit.svelte.dev/docs/types#app
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

	/** GUI Data for various control bindings to internal entities */
	interface GUIData {
		brushSize: number;
		brushColor: string;
	}

	interface Entity {
		id: number;
		type: string;
		zIndex: number;
		draw?: (() => void) | null;
	}

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:mousewheel'?: (event: any) => any;
		}
	}

}

export { };
