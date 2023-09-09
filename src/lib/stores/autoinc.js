import { readable, derived } from 'svelte/store';

export const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});

const start = new Date();

// @ts-ignore - Svelte doesn't like the derived type
export const elapsed = derived(time, ($time) => Math.round(($time - start) / 1000));