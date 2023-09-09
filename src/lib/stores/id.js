
export function createIdManager() {
  let value = 0;

  const id = () => {
    return value++;
  }

  return {
    id: id
  }
}

export const idManager = createIdManager();