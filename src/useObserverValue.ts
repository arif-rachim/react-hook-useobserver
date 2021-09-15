import {useState} from "react";
import {Observer} from "./useObserver";
import {useObserverListener} from "./useObserverListener";

export function useObserverValue<S>(observer:Observer<S>,mapper?:(value:S) => any):any;
export function useObserverValue(observer:Observer<any>[],mapper?:(value:[]) => any):any;
export function useObserverValue(observers:any,mapper?:(any) => any){
    const [state, setState] = useState(() => {
        if(Array.isArray(observers)){
            return (observers as Observer<any>[]).map((value:Observer<any>) => value.current);
        }else{
            return observers.current;
        }
    });

    useObserverListener(observers,(value) => {
        if(mapper){
            setState(mapper(value));
        }else{
            setState(value);
        }

    });
    return state;
}