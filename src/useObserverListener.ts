import {useLayoutEffect, useRef} from "react";
import {Observer} from "./useObserver";

export function useObserverListener<S>(observer:Observer<S>,listener:(value:S) => void):void;
export function useObserverListener(observer:Observer<any>[],listener:(value:any[]) => void):void;
export function useObserverListener(observers: any, listener: (value: any) => void) {
    const observerIsUndefined = observers === undefined;
    const observerIsArray = observerIsUndefined ? false : Array.isArray(observers);
    let observerArray = observerIsArray ? observers : [observers];
    const propsRef = useRef({listener, observerArray, observerIsArray});
    propsRef.current = {listener, observerArray, observerIsArray};

    useLayoutEffect(() => {

        function listener(index: number) {
            return function invokerExecutor(newValue) {
                let currentValue = propsRef.current.observerArray.map(o => o.current);
                let newValues = [...currentValue];
                newValues.splice(index, 1, newValue);
                const values = propsRef.current.observerIsArray ? newValues : newValues[0];
                propsRef.current.listener.apply(null, [values]);
            };
        }
        const removeListeners: Function[] = propsRef.current.observerArray.map(($o, index) => $o.addListener(listener(index)));
        return () => removeListeners.forEach(removeListener => removeListener.call(null))
    }, []);
}