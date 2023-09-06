import { idManager } from "./id";
import { writable, get } from "svelte/store";


/**
 * Entity Management
 * @param {HTMLCanvasElement} [element] 
 */
export function createEntityStore(element = undefined) {

  /** @type {import('svelte/store').Writable<any>} */
  const entities = writable([]);
  const canvas = writable(element);


  const addEntity = (obj = {}) => {
    let entIndex = get(entities).length === 0 ? 1 : Math.max.apply(null, get(entities).map(/** @param {any} e */(e) => e.zIndex)) + 1;
    /** @type {Entity} */
    const ent = Object.assign({ id: 0, type: 'entity', zIndex: entIndex, draw: null }, obj);
    ent.id = idManager.id();

    const defaultDraw = () => {
      console.warn("An entities draw was called on an entity it does not exist on. Please add a draw function to the entity.");
      console.log("Entity:", obj);
      console.warn("This warning will now be suppressed.");
      entities.update((ents) => {
        ents.map(/** @param {any} e */(e) => {
          if (e.id === ent.id) {
            e.enabled = false;
          }
          return e;
        });
        return ents;
      })
    };

    ent.draw = ent.draw === null ? defaultDraw : ent.draw;


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

  /** @param {number} id - id of the entity to moveup */
  const moveEntityZindexUp = (id) => {
    /** @type {number} */
    let currentIndex = get(entities).filter(/** @param {any} e */(e) => e.id === id)[0].zIndex;
    if (currentIndex === 1) return;

    let swapEnt = get(entities).filter(/** @param {any} e */(e) => e.zIndex === currentIndex - 1)[0];

    entities.update((ents) => {
      ents.filter(/** @param {any} e */(e) => e.id === id)[0].zIndex--;
      ents.filter(/** @param {any} e */(e) => e.id === swapEnt.id)[0].zIndex++;
      return ents;
    });
  }

  /** @param {number} id - id of the entity to movedown */
  const moveEntityZindexDown = (id) => {
    /** @type {number} */
    let currentIndex = get(entities).filter(/** @param {any} e */(e) => e.id === id)[0].zIndex;
    if (currentIndex === get(entities).length) return;

    let swapEnt = get(entities).filter(/** @param {any} e */(e) => e.zIndex === currentIndex + 1)[0];

    entities.update((ents) => {
      ents.filter(/** @param {any} e */(e) => e.id === id)[0].zIndex++;
      ents.filter(/** @param {any} e */(e) => e.id === swapEnt.id)[0].zIndex--;
      return ents;
    });
  }

  return {
    subscribe: entities.subscribe,
    set: entities.set,
    update: entities.update,
    addEntity: addEntity,
    updateCanvas: updateCanvas,
    canvas: canvas,
    moveUp: moveEntityZindexUp,
    moveDown: moveEntityZindexDown
  }
}