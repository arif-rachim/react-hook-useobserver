import useObserver from "./useObserver";
import * as React from "react";
import {shallow} from "enzyme";

function ObserverTest({initialValue}){
    const [$value] = useObserver(initialValue);
    return <div id={'content'}>
        {$value.current}
    </div>
}


test('Test app should not crash', () => {
    const test = shallow(<ObserverTest initialValue={'Hello World'}/>)
    expect(test.find('#content').html()).toMatch('<div id="content">Hello World</div>');

    // // manually trigger the callback
    // tree.props.onMouseEnter();
    // // re-rendering
    // tree = component.toJSON();
    // expect(tree).toMatchSnapshot();

    // // manually trigger the callback
    // tree.props.onMouseLeave();
    // // re-rendering
    // tree = component.toJSON();
    // expect(tree).toMatchSnapshot();
});