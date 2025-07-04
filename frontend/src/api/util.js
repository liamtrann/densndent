// Utility to delay a function call with setTimeout, and return a cleanup function
export function delayCall(fn, delay = 100) {
    const timeout = setTimeout(fn, delay);
    return () => clearTimeout(timeout);
}
