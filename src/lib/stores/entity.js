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
   * Add an entity to be managed
   * @param {Partial<Entity>} obj entity config object
   * @returns {number} id of the entity
   */
  const addEntity = (obj = {}) => {
    let entIndex = get(entities).length === 0 ? 1 : Math.max.apply(null, get(entities).map(/** @param {any} e */(e) => e.zIndex)) + 1;
    /** @type {Entity} */
    const ent = Object.assign({ id: 0, type: 'entity', zIndex: entIndex, selected: false, visible: true, opacity: 1 }, obj);
    ent.id = idManager.id();

    entities.update((arr) => {
      arr.push(ent);
      return arr;
    })

    console.log('added entity', ent);
    return ent.id;
  }

  /** @param {HTMLCanvasElement} element */
  const updateCanvas = (element) => {
    canvas.set(element);
  }

  /**
   * this resets all other entities to unselected unless the id matches,
   * use addEntitySelection to add multiple selections
   * @param {number} id 
   */
  const selectEntity = (id) => {
    entities.update((ents) => {
      ents.map(/** @param {any} e */(e) => {
        e.selected = e.id === id ? !e.selected : false;
        return e;
      });
      return ents;
    })
  }

  /**
   * this will not modify other entities selected property and thus can be used
   * for multiple selections. Use selectEntity to only select one entity at a time
   * @param {number} id 
   */
  const addEntitySelection = (id) => {
    entities.update((ents) => {
      ents.map(/** @param {any} e */(e) => {
        if (e.id === id) {
          e.selected = true;
        }
        return e;
      });
      return ents;
    })
  }

  /** @param {number} id - @param {boolean} vis */
  const setEntityVis = (id, vis) => {
    entities.update((ents) => {
      ents.map(/** @param {any} e */(e) => {
        if (e.id === id) {
          e.visible = vis;
        }
        return e;
      });
      return ents;
    })
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

  /**
   * @param {number} id - id of the entity to modify
   * @param {string} prop - property to modify
   * @param {any} value - value to set
   */
  const setEntityProperty = (id, prop, value) => {
    console.log('setting property', id, prop, value)
    entities.update((ents) => {
      ents.map(/** @param {any} e */(e) => {
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
    moveUp: moveEntityZindexUp,
    moveDown: moveEntityZindexDown,
    selectEntity: selectEntity,
    addEntitySelection: addEntitySelection,
    hideEntity: /** @param {number} id */(id) => setEntityVis(id, false),
    showEntity: /** @param {number} id */(id) => setEntityVis(id, true),
    changeOpacity: /** @param {number} id - @param {number} val */(id, val) => setEntityProperty(id, 'opacity', val),
  }
}