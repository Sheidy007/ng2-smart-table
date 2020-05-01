import { cloneDeep } from 'lodash';

/**
 * Extending object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
export const deepExtend = (...objects: Array<any>) => {
  if (!objects.length || typeof objects[0] !== 'object') {
    return false;
  }

  if (objects.length < 2) {
    return objects[0];
  }

  const target = objects[0];

  // convert arguments to array and cut off target object
  const args = Array.prototype.slice.call(objects, 1);


  args.forEach((obj: any) => {
    // skip argument if it is array or isn't object
    if (typeof obj !== 'object' || Array.isArray(obj)) {
      return;
    }

    Object.keys(obj).forEach((key) => {
      const src = target[key]; // source value
      const val = obj[key]; // new value

      // recursion prevention
      if (val === target) {
        return;

      } else if (typeof val !== 'object' || val === null) {
        target[key] = val;
        return;

        // just clone arrays (and recursive clone objects inside)
      } else if (Array.isArray(val)) {
        target[key] = cloneDeep(val);
        return;

        // overwrite by new value if source isn't object or array
      } else if (typeof src !== 'object' || src === null || Array.isArray(src)) {
        target[key] = deepExtend({}, val);
        return;

        // source value and new value is objects both, extending...
      } else {
        target[key] = deepExtend(src, val);
        return;
      }
    });
  });

  return target;
};

export class Deferred {

  promise: Promise<any>;

  resolve: any;
  reject: any;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}


export function getDeepFromObject(object = {}, name: string, defaultValue?: any) {
  const keys = name.split('.');
  let level = deepExtend({}, object);
  keys.forEach((k) => {
    if (level && !!level[k]) {
      level = level[k];
    }
  });
  return !level ? defaultValue : level;
}
