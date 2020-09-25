export class MultiStringFullFilter {

  static filter(cell?: any, search?: string): boolean {
    if (!search || !search.length) {
      return true;
    }
    const searchArr: string[] = search.split('|');
    if (cell == null) {
      return !search;
    }
    const cellArr: string[] = cell.toString().split('\n');
    return !!searchArr.find(s => cellArr.includes(s));
  }
}
