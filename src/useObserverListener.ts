/**
 * hook to listen when observer is changed, this is an alternative then using the addListener in observer.
 * @param {{current}|{current}[]} observers
 * @param {function(any)} listener
 */
import {Observer} from "./useObserver";
import {useLayoutEffect, useRef} from "react";
import {isFunction, isNullOrUndefined} from "./utils";

export type ObserverOrObservers<S> = Observer<S>|Observer<S>[];
export type ObserverValue<S> = S | (S|null)[] | null;
export type UseObserverListener<S> = (value: ObserverValue<S>) => void;

export default function useObserverListener<S>(observers:ObserverOrObservers<S>, listener:UseObserverListener<S>) {
    const observerIsUndefined = observers === undefined;
    const observerIsArray = observerIsUndefined ? false : Array.isArray(observers);
    let observerArray:Observer<S>[] = observerIsArray ? (observers as Observer<S>[]) : [(observers as Observer<S>)];
    const propsRef = useRef({listener,observerArray,observerIsArray});
    propsRef.current = {listener,observerArray,observerIsArray};

    useLayoutEffect(() => {
        const {listener:listenerCallback,observerArray,observerIsArray} = propsRef.current;
        function listener(index:number) {
            return function invokerExecutor(newValue:S) {
                let currentValue = observerArray.map(o => o.current);
                let newValues = [...currentValue];
                newValues.splice(index, 1, newValue);
                const values: S | (S | null)[] | null = observerIsArray ? newValues : newValues[0];
                listenerCallback.apply(null, [values]);
            };
        }

        const removeListeners:Function[] = observerArray.map(($o, index) => {
            if (isNullOrUndefined($o) || !isFunction($o.addListener)) {
                console.warn('We have undefined observer this might cause issue in future');
                return () => {
                };
            }
            return $o.addListener(listener(index));
        });
        return () => removeListeners.forEach(removeListener => removeListener.call(null))
    }, []);
}