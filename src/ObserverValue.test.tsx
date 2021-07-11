import useObserver from "./useObserver";
import * as React from "react";
import {mount} from "enzyme";
import {useEffect} from "react";
import waitForExpect from "wait-for-expect";
import {useObserverValue} from "./useObserverValue";
import {act} from "react-dom/test-utils";
import {useObserverMapper} from "./useObserverMapper";

function ObserverTest({initialValue}){
    const [$value] = useObserver(initialValue);
    return <div id={'content'}>
        {$value.current}
    </div>
}
function ObserverValueTestWithInitialData({value}){
    const [$value] = useObserver(value);
    return <div id={'content'}>
        {useObserverValue($value)}
    </div>
}

function ObserverTestWithUpdateState({value}){
    const [$value,setState] = useObserver();
    useEffect(() => {
        setState(value)
    },[value]);
    return <div id={'content'}>
        {useObserverValue($value)}
    </div>
}

function TestMultipleObserverValue({propOne,propTwo}){
    const [$stateOne,setStateOne] = useObserver(propOne);
    const [$stateTwo,setStateTwo] = useObserver(propTwo);
    const [stateOne,stateTwo] = useObserverValue([$stateOne,$stateTwo]);
    return <div id={'content'}>
        {stateOne} {stateTwo}
    </div>
}

function TestMultipleObserverValueWithEffect({propOne='',propTwo=''}){
    const [$stateOne,setStateOne] = useObserver(propOne);
    const [$stateTwo,setStateTwo] = useObserver(propTwo);
    const shit = useObserverValue($stateOne);

    const [stateOne,stateTwo] = useObserverValue([$stateOne,$stateTwo]);
    useEffect(() => {
        setTimeout(() => {
            setStateOne('ABC');
            setTimeout(() => {
                setStateTwo('DEF');
            },1000);
        },1000);
    },[])
    useEffect(() => {
        setStateOne(propOne);
        setStateTwo(propTwo);
    },[propOne,propTwo]);
    return <div id={'content'}>
        {stateOne} {stateTwo}
    </div>
}

function UnMountChild(){
    const [$data,setData] = useObserver(true);
    const toggle = useObserverValue($data);
    useEffect(() => {
        setTimeout(() => {
            console.log('Setting data');
            setData(old => {
                console.log('We have old data',old);
                return !old;
            });
        },1000);
    },[]);
    return <div id="content">{toggle ? <Detail initialValue={'Hello'}/> : <label>No Child</label>}</div>
}
function Detail({initialValue}) {
    const [$value] = useObserver(initialValue);

    return <div>
        {useObserverValue($value)}
    </div>
}

test('Test initial state with value', () => {
    const test = mount(<ObserverTest initialValue={'Hello World'}/>)
    expect(test.find('#content').html()).toMatch('<div id="content">Hello World</div>');
});

test('Test initial state with factory function', () => {
    const test = mount(<ObserverTest initialValue={() => 'Hello World'}/>)
    expect(test.find('#content').html()).toMatch('<div id="content">Hello World</div>');
});

test('Test update state with value', async () => {
    const test = mount(<ObserverTestWithUpdateState value={'Hello World'}/>)
    await waitForExpect(() => {
        expect(test.find('#content').html()).toMatch('<div id="content">Hello World</div>');
    })
});

test('Test useObserverValue with initial data', async () => {
    const test = mount(<ObserverValueTestWithInitialData value={'Hello World'}/>)
    await waitForExpect(() => {
        expect(test.find('#content').html()).toMatch('<div id="content">Hello World</div>');
    })
});

test('Test useObserverValue with initial data with function constructor', async () => {
    const test = mount(<ObserverValueTestWithInitialData value={() =>'Hello World'}/>)
    await waitForExpect(() => {
        expect(test.find('#content').html()).toMatch('<div id="content">Hello World</div>');
    })
});

test('Test multiple observer values',async () => {
    const test = mount(<TestMultipleObserverValue propOne={'Hello'} propTwo={'World'}/>)
    await waitForExpect(() => {
        expect(test.find('#content').html()).toMatch('<div id="content">Hello World</div>');
    })
});

test('Test multiple observer values update state asyncrhonously',async () => {
    await act( async () => {
        const test = mount(<TestMultipleObserverValueWithEffect propOne={'Hello'} propTwo={'World'}/>)
        await waitForExpect(() => {
            expect(test.find('#content').html()).toMatch('<div id="content">ABC DEF</div>');
        })
    });
});

test('Test unmount child',async () => {
    await act( async () => {
        const test = mount(<UnMountChild/>)
        await waitForExpect(() => {
            expect(test.find('#content').html()).toMatch('<div id="content"><label>No Child</label></div>');
        })
    });
});