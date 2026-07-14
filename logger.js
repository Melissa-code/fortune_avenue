const DEBUG_MODE = true;

export function log(message) {
    if (DEBUG_MODE) {
        console.log(message);
    }
}