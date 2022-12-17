let logActivated = true;

export function log(...args: unknown[]): void {
  if (!logActivated) return;
  console.log(...args);
}

// to have progression indicator even when logs are off
//export const forceLog = (...args: unknown[]) => console.log(args);
export const forceLog = console.log;

export function setLogActivated(activated: boolean) {
  logActivated = activated;
}
