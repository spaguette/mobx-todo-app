import type { CancellablePromise } from "mobx/dist/internal";
import { isFlowCancellationError } from "mobx";

export const withSafeCancel = <R>(flowRes: CancellablePromise<R>) => {
  flowRes.catch((e) => {
    if (!isFlowCancellationError(e)) {
      throw e;
    }
  });
  return flowRes;
};
