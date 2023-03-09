import { DestroyRef, effect, inject, Signal, signal } from "@angular/core";
import { Observable, shareReplay } from "rxjs";

export function fromObservable<T>(
  obs$: Observable<T>,
  initialValue: T
): () => T {
  const sig = signal(initialValue);
  const destroy = inject(DestroyRef);

  const sub = obs$.subscribe((val) => sig.update(() => val));
  destroy.onDestroy(() => {
    sub.unsubscribe();
  });

  return sig.bind(sig);
}

export function fromSignal<T>(source: Signal<T>): Observable<T> {
  // Creating a new `Observable` allows the creation of the effect to be lazy. This allows for all
  // references to `source` to be dropped if the `Observable` is fully unsubscribed and thrown away.
  const observable = new Observable<T>(observer => {
    const watcher = effect(() => {
      try {
        observer.next(source());
      } catch (err) {
        observer.error(err);
      }
    });
    return () => {
      watcher.destroy();
    };
  });

  // Pipe via `shareReplay` to share the single backing `effect` across all interested subscribers.
  // This of course has timing implications for when new subscribers show up. We turn on `refCount`
  // so that once all subscribers are unsubscribed, the underlying `effect` can be cleaned up. We
  // set a `bufferSize` of 1 to only cache the latest value.
  return observable.pipe(shareReplay({refCount: true, bufferSize: 1}));
}