import {useObserver} from "./useObserver";
import * as React from "react";
import {useEffect} from "react";
import {mount} from "enzyme";
import waitForExpect from "wait-for-expect";
import {useObserverValue} from "./useObserverValue";
import {act} from "react-dom/test-utils";
import {ObserverValue} from "./ObserverValue";

function ObserverTest({initialValue}){
    const [$value] = useObserver(initialValue);
    return <div id={'content'}>
        {$value.current}
    </div>
}

function ObserverTestUpdateWithFunction(){
    const [$value,setValue] = useObserver(undefined);
    useEffect(() => {
        
        setValue(() => {
            return 'Dang';
        })
        
        setTimeout(() => {
            setValue(oldValue => {
                if(oldValue !== 'Dang'){
                    throw new Error();
                }
                return 'Dong';
            })
        },300);
    },[]);
    return <ObserverTestUpdateWithFunctionDetail $value={$value}/>
}

function ObserverTestUpdateWithFunctionDetail({$value}){
    const value = useObserverValue($value);
    return <div id={'content'}>{value}</div>
}

function ObserverValueTestWithInitialData({value}){
    const [$value] = useObserver(value);
    return <div id={'content'}>
        {useObserverValue($value)}
    </div>
}

function ObserverTestWithUpdateState({value}){
    const [$value,setState] = useObserver(undefined);
    useEffect(() => {
        setState(value)
    },[value]);
    return <div id={'content'}>
        {useObserverValue($value)}
    </div>
}

function ObserverTestUsingPrimitive(){
    const [$value,setState] = useObserver(false);
    useEffect(() => {
        setState(val => {
            if(val === false){
                return true;
            }else{
                throw new Error('Expected value is false');
            }
        });
        setTimeout(() => {
            setState(val => {
                if(val === true){
                    return false;
                }
                throw new Error('Expected value is true');

            });
        },100);
        setTimeout(() => {
            setState(val => {
                if(val === false){
                    return true;
                }
                throw new Error('Expected value is false');
            });
        },200);
        setTimeout(() => {
            setState(val => {
                if(val === true){
                    return false;
                }
                throw new Error('Expected value is true');
            });
        },300);

        setTimeout(() => {
            setState(val => {
                if(val === false){
                    return true;
                }
                throw new Error('Expected value is false');
            });
        },400);
        setTimeout(() => {
            // @ts-ignore
            setState(val => {
                if(val === true){
                    return 'OK';
                }
                throw new Error('Expected value is true');
            });
        },500);
    },[]);
    return <div id={'content'}>
        {useObserverValue($value)}
    </div>
}

function ObserverTestWithUpdateStateWithObserver({value}){
    const [$value,setState] = useObserver(false);
    useEffect(() => {
        setState(value)
    },[value]);
    return <div>
        <ObserverValue observers={$value} render={value => {
            return <div id={'content'}>{value}</div>
        }} />
        {useObserverValue($value)}
    </div>
}

function TestMultipleObserverValue({propOne,propTwo}){
    const [$stateOne,] = useObserver(propOne);
    const [$stateTwo,] = useObserver(propTwo);
    const [stateOne,stateTwo] = useObserverValue([$stateOne,$stateTwo]);
    return <div id={'content'}>
        {stateOne} {stateTwo}
    </div>
}

function TestMultipleObserverValueWithEffect({propOne='',propTwo=''}){
    const [$stateOne,setStateOne] = useObserver(propOne);
    const [$stateTwo,setStateTwo] = useObserver(propTwo);
    const shot = useObserverValue($stateOne);

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

test('Test multiple observer values',async () => {
    const test = mount(<ObserverTestWithUpdateStateWithObserver value={'Hello World'}/>)
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

test('Test observer data with update function',async() => {
    await act(async () => {
        const test = mount(<ObserverTestUpdateWithFunction/>);
        await waitForExpect(() => {
            expect(test.find('#content').html()).toMatch('<div id="content">Dong</div>');
        });
    });

})

test('Test until result OK',async() => {
    await act(async () => {
        const test = mount(<ObserverTestUsingPrimitive/>);
        await waitForExpect(() => {
            expect(test.find('#content').html()).toMatch('<div id="content">OK</div>');
        });
    });
})

