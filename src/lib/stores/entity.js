import { idManager } from "./id";
import { writable } from "svelte/store";


/**
 * Entity Management
 * @param {HTMLCanvasElement} [element] 
 */
export function createEntityStore(element = undefined) {

  /** @type {import('svelte/store').Writable<any>} */
  const entities = writable([]);
  const canvas = writable(element);


  const addEntity = (obj = {}) => {
    const defaultDraw = () => {
      console.warn("An entities draw was called on an entity it does not exist on. Please add a draw function to the entity.");
      console.log("Entity:", obj);
      console.warn("This warning will now be suppressed.")
    }

    const ent = Object.assign({ id: 0, type: 'entity', draw: defaultDraw }, obj);
    ent.id = idManager.id();
    entities.update((arr) => {
      arr.push(ent);
      return arr;
    })

    console.log('added entitie', ent);
    return ent.id;
  }

  /** @param {HTMLCanvasElement} element */
  const updateCanvas = (element) => {
    canvas.set(element);
  }

  return {
    subscribe: entities.subscribe,
    set: entities.set,
    update: entities.update,
    addEntity: addEntity,
    updateCanvas: updateCanvas,
    canvas: canvas
  }
}