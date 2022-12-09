import styled from "styled-components";
import { MathComponent } from "mathjax-react";
import {Fragment, useState} from "react";

export const ResultWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const HR = styled.div`
  height: 3px;
  width: 100%;
  background-color: grey;
`

function Results({data, setData}) {
    const [viewTest, setViewTest] = useState(false);

    const res = calculate(data, viewTest);

    const [, n] = data.checkN();
    const [, m] = data.checkM();

    const testInfo = <Fragment>
        <HR></HR>
        <MathComponent tex={String.raw`${res.A_.ok ? 'A_{' + n + '}^{' + m + '}={' + res.A_.res + '}' : 'A_n^m'}`} />
        <MathComponent tex={String.raw`${res.C_.ok ? 'C_{' + n + '}^{' + m + '}={' + res.C_.res + '}' : 'C_n^m'}`} />
    </Fragment>

    return <ResultWrapper onClick={() => {setViewTest(!viewTest)}}>
        <MathComponent tex={String.raw`${res.P.ok ? 'P_{' + n + '}={' + res.P.res + '}': 'P_n'}`} />
        <MathComponent tex={String.raw`${res.A.ok ? 'A_{' + n + '}^{' + m + '}={' + res.A.res + '}' : 'A_n^m'}`} />
        <MathComponent tex={String.raw`${res.C.ok ? 'C_{' + n + '}^{' + m + '}={' + res.C.res + '}' : 'C_n^m'}`} />
        {viewTest ? testInfo : <Fragment></Fragment>}
    </ResultWrapper>
}

function calculate(data, viewTest) {
    const [nOk, n] = data.checkN();
    const [mOk, m] = data.checkM();
    const [nArrOk, nArr] = data.checkNArray();
    const [nRemOk, nRem] = data.checkNRemaining();
    const [calcArrOk, calcArr, calcArrSum] = data.calcNArr();

    const res = {
        P: {
            ok: false,
            res: 0,
        },
        A: {
            ok: false,
            res: 0,
        },
        C: {
            ok: false,
            res: 0,
        },
        A_: {
            ok: false,
            res: 0,
        },
        C_: {
            ok: false,
            res: 0,
        }
    }

    if (!calcArrOk) {
        return res;
    }

    const allFact = calcArrSum === -1 ? -1 : factorial(calcArrSum);
    // считаем P
    res.P.ok = true;
    if (allFact === -1) {
        res.P.res = '\\infty'
    } else {
        let r = allFact;
        for (let k of calcArr) {
            r /= k;
        }
        res.P.res = r;
    }

    if (!mOk) {
        return res;
    }

    // считаем A и C
    res.A.ok = true;
    res.C.ok = true;
    if (m === 0) {
        res.A.res = 0;
        res.C.res = 0;
    } else if (calcArr.length === calcArr.filter(item => item === 1).length) {
        // без повторений
        res.A.res = allFact / (factorial(n - m));
        res.C.res = res.A.res / factorial(m);
    } else if (calcArr.length === calcArr.filter(item => item === -1).length) {
        // повторения-бесконечности
        res.A.res = Math.pow(n, m);
        res.C.res = factorial(n + m - 1) / factorial(n - 1) / factorial(m)
    } else {
        res.A.ok = false;
        res.C.ok = false;
    }

    if (!viewTest) {
        return res;
    }

    // считаем A_ и C_
    res.A_.ok = true;
    res.C_.ok = true;
    if (m === 0) {
        res.A_.res = 0;
        res.C_.res = 0;
    } else if (calcArr.length === calcArr.filter(item => item === 1).length) {
        // без повторений
        res.A_.res = res.A.res;
        res.C_.res = res.C.res;
    } else {
        const calculator = new NObj(0);
        for (let ni of calcArr) {
            if (ni === -1 || ni >= m) {
                calculator.addNObj(m)
            } else {
                calculator.addNObj(ni)
            }
        }
        const perms = calculator.permutations(m);
        perms.map(branch => branch.pop())
        perms.forEach(branch => branch.reverse())
        console.log("PERMS", JSON.stringify(perms));
        res.C_.res = perms.length;


        if (calcArr.length === calcArr.filter(item => item === -1).length) {
            // повторения-бесконечности
            res.A_.res = res.A.res;
        } else {
            // смешанный тип
            let count = 0;
            perms.forEach(branch => {
                const newBranch = branch.filter(item => item > 0);
                let result = factorial(newBranch.reduce((a, b) => a + b, 0));
                newBranch.forEach(item => result /= factorial(item));
                count += result;
            })
            res.A_.res = count;
        }
        // res.C_.res = res.C.res;

        // считаем C
        // 1) строим список всех чисел от [0, max(n-count, m)]
        // 2) находим все вариации где сумма равна m (это и есть ответ)



    }




    return res
}

class NObj {
    constructor(max) {
        this.max = max;
        this.deeper = null;
    }

    addNObj(max) {
        if (this.deeper === null) {
            this.deeper = new NObj(max)
        } else {
            this.deeper.addNObj(max);
        }
    }

    permutations(left) {
        if (this.deeper === null) {
            if (left <= this.max) {
                return [[left]]
            } else {
                return []
            }
        }

        let result = [];
        for (let i = 0; i <= Math.min(left, this.max); i++) {
            for (let branch of this.deeper.permutations(left - i)) {
                branch.push(i)
                result.push(branch);
            }
        }

        return result.filter(branch => branch.reduce((a, b) => a + b, 0) === left);
    }
}

function factorial(n) {
    let res = 1;
    while (n > 1) {
        res *= n;
        n -= 1;
    }
    return res;
}

export default Results;