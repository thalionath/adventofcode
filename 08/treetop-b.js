
const fs = require('fs/promises');

function score(a, r, c) {
    const left = a[r].slice(0, c);

    const right = a[r].slice(c+1);

    let top = [];
    
    for(let i=0;i<r;++i) {
        top.push(a[i][c]);
    }

    let bottom = [];

    for(let i=r+1;i<a.length;++i) {
        bottom.push(a[i][c]);
    }

    const blocking = t => t >= a[r][c];

    const view  = function(arr) {
        const v = arr.findIndex(blocking);
        return v < 0 ? arr.length : v + 1;
    }

    const vl = view(left.reverse());
    const vr = view(right);
    const vt = view(top.reverse());
    const vb = view(bottom);

    return vl * vr * vt * vb;
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const area = input.split(/\r?\n/).map(l => l.split('').map(h => parseInt(h)));
   
    const width  = area[0].length;
    const height = area.length;

    let scores = [];

    for(let r = 1; r < (height-1); ++r ) {
        for(let c = 1; c < (width-1); ++c ) {
            scores.push(score(area, r, c));
        }
    }

    return Math.max(...scores);
}

async function main() {
    try {
        const parts = [
            {part: 'b', expected: 8 },
        ];

        for( p of parts ) {
            const actual = await solver('input-test.txt');

            if( actual !== p.expected ) {
                throw new Error(`test failed, expected ${p.expected}, got ${actual}`);
            }

            console.log(
                p.part,
                await solver('input.txt')
            );
        }
    } catch (err) {
        console.log(err);
    }
}

main();