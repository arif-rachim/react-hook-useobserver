import {ReactNode} from "react";
import {ObserverOrObservers} from "./useObserverListener";
import useObserverValue from "./useObserverValue";

type ObserverValueProps<S> = {observers:ObserverOrObservers<S>,children:(value:S | (S|null)[] | null) => ReactNode};

export default function ObserverValue<S>(props:ObserverValueProps<S>) {
    const state = useObserverValue(props.observers)
    return props.children(state);
}