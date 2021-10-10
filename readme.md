# React Hook useObserver.

Avoid excessive re-rendering in your React app by using `useObserver` and `useObserverListener` as an alternative to `useState` and `useEffect`.

Both `useState` and `useEffect` are frequently used hooks. However, if not used correctly, these two hooks are the source of React application performance issue. The issue with useState is that whenever we call setState, react re-renders the component where we declared the useState. If we place useState at the parent component level and there are child components that are really sophisticated and heavy, this will be disastrous. 
We may use `useObserver` and `useObserverListener` to solve this.

###### The following are examples of common uses of useState.

```jsx
import React, { useState } from 'react';
import {DataGrid} from './DataGrid'
function Example() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);

    return (
        <div>
            <DisplayCount count={count} />
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <DataGrid/>
        </div>
    );
}

function DisplayCount({count}){
    return <p>You clicked {count} times</p>
}

```
The preceding scenario is an illustration of a common performance issue with React. We have an `Example` component with a state `count`,
and `Example` component render the `DataGrid` component. In general, the `DataGrid` component is huge and contains numerous rows. 
If we don't conduct performance optimization, such as using `React.memo`, we will run into performance issue because React will re-render 
the entire component  when the function from `setCount` is called.

###### An alternative to the above method using the useObserver is as follows:
```jsx
import React, { useState } from 'react';
import {VeryComplexChart} from './VeryComplexChart'
function Example() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useObserver(0);
    return (
        <div>
            <DisplayCount count={count} />
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <VeryComplexChart/>
        </div>
    );
}

function DisplayCount({count}){
    return <p>You clicked {useObserverValue(count)} times</p>
}
```
By changing `useObserver` instead, we have simply ensured that the DataGrid will not be re-rendered when `setCount` is invoked. 
When the `setCount` component is called, just the DisplayCount component is re-rendered.

###What does calling useObserver do?
```jsx
const [count,setCount] = useObserver(0);
```
It declares a ``observable`` variable. Our variable is called count, but we could call it anything else, like banana. 
This is a way to “preserve” some values between the function calls — useObserver is a new way to use the exact same 
capabilities that `useState` provides in react hook.

The primary distinction between `useObserver` and `useState` is the useObserver function's return an array of mutable values 
as well as the function used to `setValue`. The mutable value returned by `useObserver` is identical to the one returned by `useRef`.

As a result, we can utilize a property called "current" to access the current value of count.

```jsx
return <div>{count.current}</div>
```

###What are the benefits of using the useObserver?
useObserver will not re-render the component to which it is attached. 
So, if the component that utilizes useObserver hooks has extensive and complicated children, 
re-rendering, and performance degradation can be avoided.

###How to listen if an observer is updated
To find out if an observer is updated when setValue is called, add an event listener to the observer itself.
So basically we can rewrite our example above to something like this.
```jsx

function Example() {
    const [count, setCount] = useObserver(0);
    return (
        <div>
            <DisplayCount count={count} />
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
            <VeryComplexChart/>
        </div>
    );
}

function DisplayCount({count}){
    const [countValue,setCountValue] = useState(count.current);
    useEffect(() => {
        const removeListener = count.addListener((newCount,oldCount) => {
            setCountValue(newCount);
        });
        return () => removeListener();
    },[]);
    return <p>You clicked {countValue} times</p>
}
```

The above code is an extended version of what we would do if we wanted to listen to the value of useObserver. 
We can use `useObserverListener` hook instead using useEffect to add event listener to the observer.

```jsx
import {useObserverListener} from "./useObserverListener";

function DisplayCount({count}) {
    const [countValue,setCountValue] = useState(count.current);
    useObserverListener(count,(newCount) => {
        setCountValue(newCount);
    })
    return <p>You clicked {countValue} times</p>
}
```
We can cut the code above in half by utilizing the useObserverValue hook to receive the value from the observer.

```jsx
import {useObserverValue} from "./useObserverValue";

function DisplayCount({count}) {
    const countValue = useObserverValue(count);
    return <p>You clicked {countValue} times</p>
}
```
By using useObserver you can avoid excessive re-rendering of react.