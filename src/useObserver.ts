import {MutableRefObject, useMemo, useRef} from "react";

export type Observer<S> =
    MutableRefObject<S | undefined>
    & { addListener: (listener: (value: S) => void) => () => void };

function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function useObserver<S>(initialValue: (S | (() => S)) = undefined): [Observer<S>, (value: ((value: S) => S) | S) => void] {

    const defaultValueRef = useRef(initialValue);
    return useMemo(() => {
        let listeners: Function[] = [];
        const $value: Observer<S> = {
            current: null, addListener: () => {
                return () => {
                }
            }
        };

        const currentValue = isFunction(defaultValueRef.current) ? (defaultValueRef.current as Function).call(null) : defaultValueRef.current;

        function setValue(callbackOrValue: S | ((oldValue: S) => S)) {
            const oldVal = defaultValueRef.current;
            let newVal: S | null = null;
            if (isFunction(callbackOrValue)) {
                newVal = (callbackOrValue as ((oldValue: S) => S)).apply(null, [currentValue]);
            } else {
                newVal = callbackOrValue as S;
            }
            if (newVal === oldVal) {
                return;
            }
            $value.current = newVal;
            listeners.forEach(function listenerInvoker(l) {
                if (newVal === oldVal) {
                    return;
                }
                l.apply(l, [newVal, oldVal]);
            })
        }

        function addListener(listener: (value: S) => void) {
            listeners.push(listener);
            return () => {
                listeners.splice(listeners.indexOf(listener), 1);
            }
        }

        $value.current = currentValue;
        $value.addListener = addListener;
        return [$value, setValue]
    }, []);
}