import * as moment from 'moment';

export class DateTimeFilter {

  static dateTimeFilterFunction(cell?: any, search?: string): boolean {
    search = search.trim();
    if (!search) {
      return true;
    }

    if (!cell) {
      return false;
    }

    let less = false;
    let equal = false;
    let great = false;

    if (search.indexOf('>') >= 0) {
      great = true;
      search = search.replace('>', '');
    }

    if (search.indexOf('<') >= 0) {
      less = true;
      search = search.replace('<', '');
    }

    if (search.indexOf('=') >= 0) {
      equal = true;
      search = search.replace('=', '');
    }

    if (great && less) {
      return false;
    }

    const format = ['DD', 'DD.MM', 'MM.YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY HH', 'YYYY-MM-DD HH', 'DD.MM.YYYY HH:mm', 'YYYY-MM-DD HH:mm', 'HH:mm'];
    let momentSearch = moment(search, format);
    let momentCell = moment(cell, format);
    if (!momentSearch.isValid() || !momentCell.isValid()) {
      return false;
    }
    let onlyDate = false;
    if (momentSearch.startOf('day').isSame(momentSearch)) {
      // ввели только дату без времени (либо время 00:00)
      onlyDate = true;
    }

    let result = false;

    if (onlyDate) {
      momentSearch = momentSearch.startOf('day');
      momentCell = momentCell.startOf('day');
    }

    if (great) {
      result = result || (equal ? momentSearch.isSameOrBefore(momentCell) : momentSearch.isBefore(momentCell));
    }

    if (less) {
      result = result || (equal ? momentSearch.isSameOrAfter(momentCell) : momentSearch.isAfter(momentCell));
    }

    result = result || (equal ? momentSearch.isSame(momentCell) : false);

    if (!equal && !great && !less) {
      result = result || momentSearch.isSame(momentCell);
    }

    return result;
  }
}
