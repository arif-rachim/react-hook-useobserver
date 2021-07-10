import {useState} from "react";
import {Observer} from "./useObserver";
import useObserverListener, {ObserverOrObservers} from "./useObserverListener";


export default function useObserverValue<S>(observers:ObserverOrObservers<S>){
    const [state, setState] = useState(() => {
        if(Array.isArray(observers)){
            return (observers as Observer<any>[]).map((value:Observer<any>) => value.current);
        }else{
            return observers.current;
        }
    });
    useObserverListener(observers,(value) => setState(value));
    return state;
}