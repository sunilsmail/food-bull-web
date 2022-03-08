export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export namespace DayOfWeek {
  export function values() {
    return Object.keys(DayOfWeek).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
