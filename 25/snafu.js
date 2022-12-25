const fs = require('fs/promises');

function to_decimal(x) {
    const l = x.length;
    let sum = 0;
    for(let i = 0; i < l; ++i) {
        const sym = x[i];
        const p = l - i - 1;
        
        switch(sym) {
            case '-': sum -= 1*(5**p); break;
            case '=': sum -= 2*(5**p); break;
            default: sum += parseInt(sym)*(5**p); break;
        }
    }
    return sum;
}

function to_snafu(x) {
    let out = '';
    while(x > 0) {
        let r = x % 5;
        x -= r;
        x /= 5;
        if( r === 3 ) {
            r = '=';
            x += 1;
        } else if( r === 4) {
            r = '-';
            x += 1;
        }
        out = r + out;
    }
    return out;
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const result = input.split(/\r?\n/).map(to_decimal).reduce((a, s) => a + s);

    console.log(result);

    return result;
}

function tests() {
    const ts = [
        { expected:         1, input: '1' },
        { expected:         2, input: '2' },
        { expected:         3, input: '1=' },
        { expected:         4, input: '1-' },
        { expected:         5, input: '10' },
        { expected:         6, input: '11' },
        { expected:         7, input: '12' },
        { expected:         8, input: '2=' },
        { expected:         9, input: '2-' },
        { expected:        10, input: '20' },
        { expected:        15, input: '1=0' },
        { expected:        20, input: '1-0' },
        { expected:      2022, input: '1=11-2' },
        { expected:     12345, input: '1-0---0' },
        { expected: 314159265, input: '1121-1110-1=0' }
    ]

    for(const t of ts) {
        console.log(t)
        const a = to_decimal(t.input);
        if( a !== t.expected ) {
            throw new Error(`test ${t.input} failed: expected ${t.expected}, was ${a}`)
        }
        const s = to_snafu(t.expected);
        if( s !== t.input ) {
            throw new Error(`test ${t.expected} failed: expected ${t.input}, was ${s}`)
        }
    }
}

async function main() {
    try {
        tests();

        test = await solver('input-test.txt');

        if( test !== 4890 ) {
            throw new Error(`test failed ${test}`);
        }

        const d = await solver('input.txt');

        console.log(
            d, to_snafu(d)
        );
    } catch (err) {
        console.log(err);
    }
}

main();