export function emit(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`superpeko:${name}`, { detail }));
}
