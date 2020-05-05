export class LocalPager {

  static paginate(data: Array<any>, page: number, perPage: number): any[] {
    return data.slice(perPage * (page - 1), perPage * page);
  }
}
