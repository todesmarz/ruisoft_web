export function emit(name, detail = {}) {
  window.dispatchEvent(new CustomEvent(`pixelhopper:${name}`, { detail }));
}
