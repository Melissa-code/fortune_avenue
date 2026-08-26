const DEBUG_MODE = false;

export function log(message) {
    if (DEBUG_MODE) {
        console.log(message);
    }
}