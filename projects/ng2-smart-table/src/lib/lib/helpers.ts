import { cloneDeep } from 'lodash';

export const deepExtend = (...objects: Array<any>) => {
  if (!objects.length || typeof objects[0] !== 'object') {
    return false;
  }

  if (objects.length < 2) {
    return objects[0];
  }

  const target = objects[0];
  const args = Array.prototype.slice.call(objects, 1);

  args.forEach((obj: any) => {
    if (typeof obj !== 'object' || Array.isArray(obj)) {
      return;
    }
    Object.keys(obj).forEach((key) => {
      const src = target[key];
      const val = obj[key];

      if (val === target) {
        return;
      }
      if (typeof val !== 'object' || val === null) {
        target[key] = val;
        return;
      }
      if (Array.isArray(val)) {
        target[key] = cloneDeep(val);
        return;
      }
      if (typeof src !== 'object' || src === null || Array.isArray(src)) {
        target[key] = deepExtend({}, val);
        return;
      }
      target[key] = deepExtend(src, val);
      return;
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

