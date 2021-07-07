import useObserverListener, {ObserverOrObservers, ObserverValue} from "./useObserverListener";
import useObserver, {Observer} from "./useObserver";
import {isNullOrUndefined} from "./utils";

export default function useObserverMapper<S>(observer:ObserverOrObservers<S>, map : (value:ObserverValue<S>) => ObserverValue<S>) {
    const [newObserver, setNewObserver] = useObserver(map(getCurrentValue(observer)));
    useObserverListener(newObserver, (newValue:ObserverValue<S>) => {
        const newMapValue = map(newValue);
        setNewObserver(newMapValue);
    })
    return newObserver;
}

function getCurrentValue<S>(observers:ObserverOrObservers<S>){
    if(!isNullOrUndefined(observers)){
        if(Array.isArray(observers)){
            return (observers as Observer<S>[]).map(value => value.current);
        }else{
            return (observers as Observer<S>).current;
        }
    }
    return null;
}