import { idManager } from "./id";
import { writable, get } from "svelte/store";

/**
 * Entity management store
 * @param {HTMLCanvasElement} [element] creates the store with an element from which it can get context
 */
export function createEntityStore(element = undefined) {
  /** @type {import('svelte/store').Writable<Entity[]>} */
  const entities = writable([]);
  /** @type {import('svelte/store').Writable<HTMLCanvasElement>} */
  const canvas = writable(element);

  /**
   * Configures a new entity with the given parameters and adds it to the entity store
   * @param {Partial<Entity>} obj entity config object
   * @returns {number} id of the entity
   */
  const addEntity = (obj = {}) => {
    let entIndex = get(entities).length === 0 ? 1 : Math.max.apply(null, get(entities).map(/** @param {Entity} e */(e) => e.zIndex)) + 1;
    /** @type {Entity} */
    const ent = Object.assign({
      id: 0,
      type: 'entity',
      zIndex: entIndex,
      selected: false,
      visible: true,
      opacity: 1,
      size: { width: 0, height: 0 },
      position: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1 },
    }, obj);

    ent.id = idManager.id();

    entities.update((arr) => {
      arr.push(ent);
      return arr;
    });

    return ent.id;
  }

  /**
   * Updates the local canvas element reference
   *  @param {HTMLCanvasElement} element - canvas element to set
   */
  const updateCanvas = (element) => {
    canvas.set(element);
  }

  /**
   * Selects an entity while deselecting all others, if the entity is already selected, deselects it
   * @param {number} id - id of the entity to select (or deselect)
   */
  const selectEntity = (id) => {
    entities.update((ents) => {
      ents.map(/** @param {Entity} e */(e) => {
        e.selected = e.id === id ? !e.selected : false;
        return e;
      });
      return ents;
    })
  }

  /**
   * Changes the zIndex of an entity, reordering the array to determine render order
   * @param {number} id - id of the entity to move
   * @param {'up'|'down'} dir - direction to move the entity
   */
  const reorderSwap = (id, dir) => {
    let currentIndex = get(entities).filter(/** @param {Entity} e */(e) => e.id === id)[0].zIndex;
    if (currentIndex === 1 && dir === 'up') return;
    if (currentIndex === get(entities).length && dir === 'down') return;

    let swapUp = get(entities).filter(/** @param {Entity} e */(e) => e.zIndex === currentIndex - 1)[0];
    let swapDown = get(entities).filter(/** @param {Entity} e */(e) => e.zIndex === currentIndex + 1)[0];

    if (dir === 'up') {
      entities.update((ents) => {
        ents.filter(/** @param {Entity} e */(e) => e.id === id)[0].zIndex--;
        ents.filter(/** @param {Entity} e */(e) => e.id === swapUp.id)[0].zIndex++;
        return ents;
      });
    } else if (dir === 'down') {
      entities.update((ents) => {
        ents.filter(/** @param {Entity} e */(e) => e.id === id)[0].zIndex++;
        ents.filter(/** @param {Entity} e */(e) => e.id === swapDown.id)[0].zIndex--;
        return ents;
      });
    }
  }

  /**
   * Universal entity update function, only modifies the entity with the given id
   * @param {number} id - id of the entity to modify
   * @param {string} prop - property to modify
   * @param {any} value - value to set
   */
  const setEntityProperty = (id, prop, value) => {
    // console.log('setting property', id, prop, value)
    entities.update((ents) => {
      ents.map(/** @param {Entity} e */(e) => {
        if (e.id === id) {
          e[prop] = value;
        }
        return e;
      });
      return ents;
    })
  }

  return {
    subscribe: entities.subscribe,
    set: entities.set,
    update: entities.update,
    addEntity: addEntity,
    updateCanvas: updateCanvas,
    canvas: canvas,
    moveUp: /** @param {number} id */(id) => reorderSwap(id, 'up'),
    moveDown: /** @param {number} id */(id) => reorderSwap(id, 'down'),
    selectEntity: selectEntity,
    addEntitySelection: /** @param {number} id */(id) => setEntityProperty(id, 'selected', true),
    removeEntitySelection: /** @param {number} id */(id) => setEntityProperty(id, 'selected', false),
    hideEntity: /** @param {number} id */(id) => setEntityProperty(id, 'visible', false),
    showEntity: /** @param {number} id */(id) => setEntityProperty(id, 'visible', true),
    changeOpacity: /** @param {number} id - @param {number} val */(id, val) => setEntityProperty(id, 'opacity', val),
  }
}