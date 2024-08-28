import { QueryClient, QueryKey, QueryObserver, QueryObserverOptions } from '@tanstack/react-query';
import { createAtom, reaction, makeObservable, computed } from 'mobx';

export class MobxQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  constructor(
    private getOptions: () => QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
    private queryClient: QueryClient,
  ) {
    makeObservable(this, {
      data: computed,
    });
    this.queryObserver = new QueryObserver(this.queryClient, this.defaultOptions);
  }

  // private readonly defaultOptions: DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  private queryObserver: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  private atom = createAtom(
    // 1st parameter:
    // - Atom's name, for debugging purposes.
    'MobxReactQuery',
    // 2nd (optional) parameter:
    // - Callback for when this atom transitions from unobserved to observed.
    () => this.startTracking(),
    // 3rd (optional) parameter:
    // - Callback for when this atom transitions from observed to unobserved.
    () => this.stopTracking(),
    // The same atom transitions between these two states multiple times.
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private unsubscribe = () => {};

  get result() {
    this.atom.reportObserved();
    this.queryObserver.setOptions(this.defaultOptions);
    return this.queryObserver.getOptimisticResult(this.defaultOptions);
  }

  private get defaultOptions() {
    return this.queryClient.defaultQueryOptions(this.getOptions());
  }

  get data() {
    const data = this.result.data;

    if (!data) {
      throw this.queryObserver.fetchOptimistic(this.defaultOptions);
    }

    return data;
  }

  private startTracking() {
    const unsubscribeReaction = reaction(
      () => this.defaultOptions,
      () => {
        this.queryObserver.setOptions(this.defaultOptions);
      },
    );
    const unsubscribeObserver = this.queryObserver.subscribe(() => this.atom.reportChanged());
    this.unsubscribe = () => {
      unsubscribeReaction();
      unsubscribeObserver();
    };
  }

  private stopTracking() {
    this.unsubscribe();
  }

  // query(
  //   options?: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  // ): QueryObserverResult<TData, TError> {
  //   const opts = Object.assign({}, this.#defaultOptions, options);
  //   if (this.#observer) {
  //     this.#observer.setOptions(opts);
  //   } else {
  //     const observer = (this.#observer = new QueryObserver(queryClient, opts));
  //     runInAction(() => Object.assign(this.#reactQueryResult, observer.getCurrentResult()));
  //     this.#subscription = observer.subscribe((result) =>
  //       runInAction(() => Object.assign(this.#reactQueryResult, result)),
  //     );
  //   }
  //   return this.#reactQueryResult;
  // }

  // dispose() {
  //   this.#subscription?.();
  // }
}
