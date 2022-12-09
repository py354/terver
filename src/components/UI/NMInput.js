import styled from "styled-components";

export const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
`

export const StyledInput = styled.input`
  &:focus {
    outline: none;
  }
`

function NMInput({data, setData}) {
    const [nOk, ] = data.checkN();
    const [mOk, ] = data.checkM();

    return <InputWrapper>
        <StyledInput style={{width: "100%", borderColor: nOk ? "green" : "red"}}
               type="text" step={1} value={data.n} placeholder="Введите n"
               onChange={e => setData({...data, n: e.target.value})}/>

        <StyledInput style={{width: "100%", borderColor: mOk ? "green" : "red"}}
               type="text" step={1} value={data.m} placeholder="Введите m"
               onChange={e => setData({...data, m: e.target.value})}/>
    </InputWrapper>
}


export default NMInput;