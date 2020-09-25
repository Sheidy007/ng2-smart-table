import * as moment from 'moment';

export class DateTimeSorter {

  static dateTimeCompareFunction(direction: any, a: any, b: any, directionNull: number = 1): number {
    a = moment(a, ['DD.MM.YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY HH:mm', 'YYYY-MM-DD HH:mm']);
    b = moment(b, ['DD.MM.YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY HH:mm', 'YYYY-MM-DD HH:mm']);
    if (!a.isValid() && !b.isValid()) {
      return 0;
    } else if (!a.isValid()) {
      return directionNull ? -1 * direction * directionNull : 1;
    } else if (!b.isValid()) {
      return directionNull ? direction * directionNull : -1;
    }
    return a.isAfter(b) ? direction : a.isBefore(b) ? -1 * direction : 0;
  }

}