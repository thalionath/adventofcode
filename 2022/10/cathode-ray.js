
const fs  = require('fs/promises')
    ;

function decoder(inst) {
    if( inst === 'noop' ) {
        return [0]
    }
    return [0, parseInt(inst.slice(5))]
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' })

    const cycles = input
        .split(/\r?\n/)
        .map(decoder)
        .flat()
        ;

    const c1 = [1, ...cycles]

    const sums = c1.map((_, i, a) => a.slice(0, i+1).reduce((a, s) => a + s))
        ;

    const filter = [20, 60, 100, 140, 180, 220];

    const ss = sums.map((v, i) => {
        const n = i + 1;
        if( filter.includes(n) ) {
          return v*n;  
        }
        return 0;
    });

    const sss = ss.filter(e => e > 0);

    for(let y = 0; y < 8; y++) {
        let line = '';
        for(let i=0; i < 40; i++) {
            const o = y*40 + i;
            const sprite = [
                sums[o] - 1, sums[o] + 0, sums[o] + 1
            ];
            if( sprite.includes(i) ) {
                line += '#';
            } else {
                line += '.';
            }
        }
        console.log(line);
    }
    
    return sss.reduce((a, s) => a + s);
}

async function main() {
    try {
        test = await solver('input-test.txt', 2);

        if( test !== 13140 ) {
            throw new Error(`test failed ${test}`);
        }

        console.log(
            'a',
            await solver('input.txt', 2)
        );
    } catch (err) {
        console.log(err);
    }
}

main();