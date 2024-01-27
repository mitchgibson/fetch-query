import { FetchQuery } from "./fetch-query/fetch-query";
import { FetchQueryIterator } from "./fetch-query/fetch-query-iterator";

export class ExamplePager extends FetchQueryIterator<any> {
  constructor(private query: FetchQuery<any>) {
    super(query, {
      next: (query) => {
        if (!this.canGoNext()) return query;
        const page = query.getSearchParams().page as number;
        query.updateSearchParams({ page: page + 1 });
        return query;
      },
      previous: (query) => {
        if (!this.canGoPrevious()) return query;
        const page = query.getSearchParams().page as number;
        query.setSearchParams({ page: page - 1 });
        return query;
      },
    });
  }

  public canGoNext(): boolean {
    const page = this.query.getSearchParams().page as number;
    if (!page) return true;
    return page < 10;
  }

  public canGoPrevious(): boolean {
    const page = this.query.getSearchParams().page as number;
    if (!page) return false;
    return page > 1;
  }
}
