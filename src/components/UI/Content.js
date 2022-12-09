import styled from "styled-components";
import NMInput from "./NMInput";
import {useState} from "react";
import NSInput from "./NSInput";
import Results from "./Results";

const ContentWrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ContentStyles = styled.div`
  width: 600px;
  padding: 10px;
  background-color: #D9D9D9;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

function Content() {
    const [data, setData] = useState({
        n: "",
        m: "",
        nArray: "",
        nRemaining: "",

        checkN() {
            if (/^\d+$/.test(this.n) && parseInt(this.n) >= 0 && parseInt(this.n) <= 10) {
                return [true, parseInt(this.n)]
            }
            return [false, 0]
        },

        checkM() {
            if (this.m.length === 0) {
                return [true, 0]
            }
            const [calcArrOk, , calcArrSum] = this.calcNArr();

            if ((/^\d*$/.test(this.m)) && (!calcArrOk || ((calcArrSum === -1 || parseInt(this.m) <= calcArrSum) && parseInt(this.m) >= 0))) {
                return [true, parseInt(this.m)]
            }
            return [false, 0]
        },

        checkNArray() {
            const nArr = this.nArray.trim().split(/[ ,;\t\r\n]/)
            const result = [];
            for (let item of nArr) {
                if (item === "") {
                    continue
                }

                if (((item !== '-1') && !/^\d+$/.test(item)) || (item === '0')) {
                    return [false, []]
                }

                result.push(parseInt(item));
            }

            const [nOk, n] = this.checkN();
            if (nOk) {
                return [result.length <= n, result]
            }
            return [true, result]
        },

        checkNRemaining() {
            if (this.nRemaining === '-1') {
                return [true, -1]
            }

            if (this.nRemaining === '') {
                return [true, 1]
            }

            if (/^\d+$/.test(this.nRemaining)) {
                return [true, parseInt(this.nRemaining)]
            }

            return [false, 0]
        },

        calcNArr() {
            const [nOk, n] = this.checkN();
            const [nArrOk, nArr] = this.checkNArray();
            const [nRemOk, nRem] = this.checkNRemaining();

            if (!(nOk && nArrOk && nRemOk)) {
                return [false, [], 0]
            }

            for (let i = n - nArr.length; i > 0; i--) {
                nArr.push(nRem);
            }

            if (nRem === -1 || nArr.includes(-1)) {
                return [true, nArr, -1]
            }
            return [true, nArr, nArr.reduce((a, b) => a + b, 0)];
        }
    })
    console.log("render with", data);
    return <ContentWrapper>
        <ContentStyles>
            <NMInput data={data} setData={setData}></NMInput>
            <NSInput data={data} setData={setData}></NSInput>
            <Results data={data} setData={setData}></Results>
        </ContentStyles>
    </ContentWrapper>
}

export default Content;