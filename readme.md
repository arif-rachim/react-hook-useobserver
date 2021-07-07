# React Hook useObserver.

useObserver and useObserverListener are alternatives to useState and useEffect which can avoid excessive re-rendering in
your react app.

useState and useEffect are two very frequently used hooks. However, these two hooks are the source of the performance degradation of React applications if not used properly. The problem with useState is that every time we call setState, react will re-render the component where we declared the useState. This will be very fatal if we put useState at the parent component level, and there are child components that are very complex and heavy. To solve this we can use useObserver and useObserverListener.

###### The following are examples of common uses of useState.

```
function Index(){
    const [date,setDate] = useState(new Date());
    return <>
        <DependentComponent date={date} />
        <SetDateComponent setDate={setDate} />
        <VeryHeavyComplexComponent />
    </>
}

function DependentComponent({date}){
  return <div>State value{date.toString()}</div>
}
function SetDateComponent({setDate}){
  return <button onClick={() => setDate(new Date())}>Click</button>
}

function VeryHeavyComplexComponent(){
  return ....
}
```

###### An alternative to the above method using the useObserver is as follows:
```
function Index(){
    const [date,setDate] = useObserver(new Date());
    return <>
        <DependentComponent date={date} />
        <SetDateComponent setDate={setDate} />
        <VeryHeavyComplexComponent />
    </>
}

function DependentComponent({date}){
  return <div>State value{useObserverValue(date).toString()}</div>
}
function SetDateComponent({setDate}){
  return <button onClick={() => setDate(new Date())}>Click</button>
}
function VeryHeavyComplexComponent(){
  return ....
}
```

By using useObserver you can avoid excessive re-rendering of react.