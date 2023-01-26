const loadState = () => {
  try {
    const state = localStorage.getItem('state');
    if (state === null) {
      return undefined;
    } else {
      return JSON.parse(state)
    }
  } catch (err) {
    return undefined;
  }
}

const saveState = state => {
  try {
    localStorage.setItem('state', JSON.stringify(state))
  } catch {

  }
}

export {loadState, saveState};