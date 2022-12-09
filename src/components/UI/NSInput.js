import {InputWrapper, StyledInput} from "./NMInput";

function NSInput({data, setData}) {
    const [nArrOk, ] = data.checkNArray();
    const [nRemOk, ] = data.checkNRemaining();

    return <InputWrapper>
        <StyledInput style={{width: "100%", borderColor: nArrOk ? "green" : "red"}} type="text"
               placeholder="Введите через запятую n" value={data.nArray}
               onChange={e => setData({...data, nArray: e.target.value})}/>

        <StyledInput style={{width: "100%", borderColor: nRemOk ? "green" : "red"}} type="text"
               placeholder="Все остальные n (-1 для &#8734;)" value={data.nRemaining}
               onChange={e => setData({...data, nRemaining: e.target.value})}/>
    </InputWrapper>
}

export default NSInput;