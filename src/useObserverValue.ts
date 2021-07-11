import {useState} from "react";
import {Observer} from "./useObserver";
import {useObserverListener} from "./useObserverListener";

export function useObserverValue<S>(observer:Observer<S>):S
export function useObserverValue(observer:Observer<any>[]):any[];
export function useObserverValue(observers:any){
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