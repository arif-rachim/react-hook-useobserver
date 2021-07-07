import {useMemo, useRef} from "react";

export type ValueFactory<Value> = () => Value;
export type ValueMutator<Value> = (oldValue: Value) => Value;
export type SetValue<Value> = Value | ValueFactory<Value>;
export type Listener<S> = (value: S) => void;
export type Observer<S> = { current: S | null, addListener: (listener: Listener<S>) => () => void };


function isFunction(functionToCheck: any) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export default function useObserver<S>(defaultValue: SetValue<S>): [Observer<S>, (callbackOrValue: S | ValueMutator<S>) => void] {
    const defaultValueRef = useRef(defaultValue);
    return useMemo(() => {
        let listeners: Function[] = [];
        const $value: Observer<S> = {
            current: null, addListener: () => {
                return () => {
                }
            }
        };
        const currentValue = isFunction(defaultValueRef.current) ? (defaultValueRef.current as Function).call(null) : defaultValueRef.current;


        function setValue(callbackOrValue: S | ValueMutator<S>) {
            const oldVal = defaultValueRef.current;
            let newVal: S | null = null;
            if (isFunction(callbackOrValue)) {
                newVal = (callbackOrValue as ValueMutator<S>).apply(null, [currentValue]);
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

        $value.addListener = addListener;
        return [$value, setValue]
    }, []);
}