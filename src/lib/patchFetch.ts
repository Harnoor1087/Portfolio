// Polyfill/safeguard for environments where window.fetch has only a getter without a setter
(function initFetchPatch() {
  if (typeof window === 'undefined') return;

  try {
    const targetObj: any = window;
    const desc = Object.getOwnPropertyDescriptor(targetObj, 'fetch');
    const protoDesc =
      typeof Window !== 'undefined' && Window.prototype
        ? Object.getOwnPropertyDescriptor(Window.prototype, 'fetch')
        : null;

    // Check if fetch descriptor has a getter but lacks a setter
    const hasGetterNoSetter =
      (desc && desc.get && !desc.set) ||
      (protoDesc && protoDesc.get && !protoDesc.set);

    if (hasGetterNoSetter || !desc || desc.writable === false) {
      const nativeFetch = targetObj.fetch;
      let activeFetch =
        typeof nativeFetch === 'function'
          ? function (this: any, ...args: any[]) {
              return nativeFetch.apply(this || window, args);
            }
          : nativeFetch;

      try {
        Object.defineProperty(targetObj, 'fetch', {
          get() {
            return activeFetch;
          },
          set(newFn: any) {
            activeFetch = newFn;
          },
          configurable: true,
          enumerable: true,
        });
      } catch (err1) {
        if (typeof Window !== 'undefined' && Window.prototype) {
          try {
            Object.defineProperty(Window.prototype, 'fetch', {
              get() {
                return activeFetch;
              },
              set(newFn: any) {
                activeFetch = newFn;
              },
              configurable: true,
              enumerable: true,
            });
          } catch (err2) {
            // Ignore if sealed
          }
        }
      }
    }
  } catch {
    // Graceful fallback
  }
})();

export {};
