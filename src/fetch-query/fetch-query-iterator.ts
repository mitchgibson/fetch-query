import { FetchQuery } from "./fetch-query";

export type FetchQueryIteratorStrategy<T> = (query: FetchQuery<T>) => FetchQuery<T>;
export type FetchQueryIteratorConfig<T> = {
  next?: FetchQueryIteratorStrategy<T>;
  previous?: FetchQueryIteratorStrategy<T>;
};

export class FetchQueryIterator<T> {
  constructor(private fetchQuery: FetchQuery<T>, private config: FetchQueryIteratorConfig<T>) {}

  public next(): void {
    if (!this.config.next) {
      throw new Error("No next strategy defined");
    }
    this.config.next(this.fetchQuery);
    this.fetchQuery.query();
  }

  public previous(): void {
    if (!this.config.previous) {
      throw new Error("No previous strategy defined");
    }
    this.config.previous(this.fetchQuery);
    this.fetchQuery.query();
  }
}
