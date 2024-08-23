import {
  DefaultedQueryObserverOptions,
  QueryKey,
  QueryObserver,
  QueryObserverOptions,
  QueryObserverResult,
} from '@tanstack/react-query';
import { observable, runInAction } from 'mobx';
import { queryClient } from './mobx-query-provider';

// @see https://codesandbox.io/s/mobx-react-query-integration-8lpjg4?file=/src/shared/query/mobx-query.ts
export class MobxQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> {
  readonly defaultOptions: DefaultedQueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  private observer?: QueryObserver<TQueryFnData, TError, TData, TQueryData, TQueryKey>;
  private reactQueryResult = observable({}, { deep: false }) as QueryObserverResult<TData, TError>;
  private subscription?: () => void;

  constructor(options: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>) {
    const { _defaulted, ...defaultOptions } = queryClient.defaultQueryOptions(options);
    this.defaultOptions = defaultOptions;
  }

  query(
    options?: QueryObserverOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>,
  ): QueryObserverResult<TData, TError> {
    const opts = Object.assign({}, this.defaultOptions, options);
    if (this.observer) {
      this.observer.setOptions(opts);
    } else {
      const observer = (this.observer = new QueryObserver(queryClient, opts));
      runInAction(() => Object.assign(this.reactQueryResult, observer.getCurrentResult()));
      this.subscription = observer.subscribe((result) =>
        runInAction(() => Object.assign(this.reactQueryResult, result)),
      );
    }
    return this.reactQueryResult;
  }

  dispose() {
    this.subscription?.();
  }
}
