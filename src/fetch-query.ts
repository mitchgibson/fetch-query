import { retry, switchMap, take } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { BehaviorSubject, from } from "rxjs";

export type FetchQueryError = {
  status: number;
  message: string;
};

/**
 * FetchQuery is a wrapper around the fetch API that provides a simple interface for making requests.
 *
 * @example const { error, loading, data } = new FetchQuery<MyThing>('https://jsonplaceholder.typicode.com/todos/1').query();
 * 
 * console.log(error, loading, data);
 * @example const fetch = new FetchQuery<MyThing>('https://jsonplaceholder.typicode.com/todos/1');
 * 
 * fetch.onLoading((loading) => console.log(loading));
 * fetch.onData((data) => console.log(data));
 * fetch.onError((error) => console.log(error));
 * 
 * fetch.query();
 * @example const fetch = new FetchQuery<MyThing>('https://jsonplaceholder.typicode.com/todos/1', { method: 'POST', body: { id: 1 } });
 * const fetch = new FetchQuery<MyThing>('https://jsonplaceholder.typicode.com/todos/1');
 * fetch.query();
 * @example const fetch = new FetchQuery<MyThing>('https://jsonplaceholder.typicode.com/todos/1');
 * fetch.setRetries(3);
 * fetch.query({ method: 'POST', body: { id: 1 } });

 */
export class FetchQuery<T> {
  private _data: T | null = null;
  private _error: FetchQueryError | null = null;
  private _loading: boolean = false;
  private _maxRetryCount: number = 0;

  private loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this._loading);
  private data$: BehaviorSubject<T | null> = new BehaviorSubject<T | null>(this._data);
  private error$: BehaviorSubject<FetchQueryError | null> = new BehaviorSubject<FetchQueryError | null>(this._error);

  constructor(private url: string | Request, private options?: RequestInit) {}

  public get data(): T | null {
    return this._data;
  }

  public get error(): FetchQueryError | null {
    return this._error;
  }

  public get loading(): boolean {
    return this._loading;
  }

  public onLoadingChange(callback: (loading: boolean) => void): void {
    this.loading$.subscribe(callback);
  }

  public onDataChange(callback: (data: T | null) => void): void {
    this.data$.subscribe(callback);
  }

  public onErrorChange(callback: (error: FetchQueryError | null) => void): void {
    this.error$.subscribe(callback);
  }

  public setRetries(maxRetryCount: number): void {
    if (maxRetryCount < 0) {
      throw new Error("maxRetryCount must be greater than or equal to 0");
    }
    this._maxRetryCount = maxRetryCount;
  }

  public query(options: RequestInit | undefined = this.options): FetchQuery<T> {
    this.updateLoading(true);
    this.updateError(null);
    fromFetch(this.url, options)
      .pipe(
        take(1),
        switchMap((response) => {
          if (response.ok) {
            return from(response.json());
          }
          throw response;
        }),
        retry(this._maxRetryCount)
      )
      .subscribe({
        next: (response) => {
          this.updateData(response);
        },
        error: (error) => {
          this.updateError({
            status: error.status,
            message: error.statusText,
          });
        },
        complete: () => {
          this.updateLoading(false);
        },
      });

    return this;
  }

  private updateLoading(loading: boolean): void {
    this._loading = loading;
    this.loading$.next(loading);
  }

  private updateData(data: T | null): void {
    this._data = data;
    this.data$.next(data);
  }

  private updateError(error: FetchQueryError | null): void {
    this._error = error;
    this.error$.next(error);
  }
}
