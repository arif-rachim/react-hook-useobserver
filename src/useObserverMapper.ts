import {useObserverListener} from "./useObserverListener";
import useObserver, {Observer} from "./useObserver";
import {isNullOrUndefined} from "./utils";

export function useObserverMapper<S, S1>(observer: Observer<S>, map: (value: S) => S1): Observer<S1>;
export function useObserverMapper<S>(observer: Observer<any>[], map: (value: any[]) => S): Observer<S>;
export function useObserverMapper(observer, map: (value: any) => any) {
    const [newObserver, setNewObserver] = useObserver(map(getCurrentValue(observer)));
    useObserverListener(newObserver, (newValue) => {
        const newMapValue = map(newValue);
        setNewObserver(newMapValue);
    })
    return newObserver;
}

function getCurrentValue(observers) {
    if (!isNullOrUndefined(observers)) {
        if (Array.isArray(observers)) {
            return observers.map(value => value.current);
        } else {
            return observers.current;
        }
    }
    return null;
}