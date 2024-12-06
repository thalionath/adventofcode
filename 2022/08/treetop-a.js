
const fs = require('fs/promises');


function is_visible(a, r, c) {
    const left = a[r].slice(0, c);

    if( Math.max(...left) < a[r][c] ) {
        return true;
    }

    const right = a[r].slice(c+1);

    if( Math.max(...right) < a[r][c] ) {
        return true;
    }

    let top = [];
    
    for(let i=0;i<r;++i) {
        top.push(a[i][c]);
    }

    if( Math.max(...top) < a[r][c] ) {
        return true;
    }

    let bottom = [];

    for(let i=r+1;i<a.length;++i) {
        bottom.push(a[i][c]);
    }

    if( Math.max(...bottom) < a[r][c] ) {
        return true;
    }

    // console.log(r, c, a[r][c], left, right, top, bottom);

    return false;
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const area = input.split(/\r?\n/).map(l => l.split('').map(h => parseInt(h)));
   
    const width  = area[0].length;
    const height = area.length;

    let visible = 2*width + 2*(height-2);

    for(let r = 1; r < (height-1); ++r ) {
        for(let c = 1; c < (width-1); ++c ) {
            if( is_visible(area, r, c) ) {
                visible += 1;
            }
        }
    }

    return visible;
}

async function main() {
    try {
        const parts = [
            {part: 'a', expected: 21 },
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