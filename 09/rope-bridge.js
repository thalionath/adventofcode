
const fs  = require('fs/promises')
    ;

function is_touching(h, t) {
    const xs = [h[0] - 1, h[0] + 0, h[0] + 1]
          ys = [h[1] - 1, h[1] + 0, h[1] + 1]
          ;
    return xs.includes(t[0]) && ys.includes(t[1]);
}

function compute_offset(h, t) {

    if( is_touching(h, t) ) {
        return [0, 0];
    }

    if( t[0] === h[0] ) { // same x
        if( t[1] < h[1] ) {
            return [0, +1];
        } else {
            return [0, -1];
        }
    }

    if( t[1] === h[1] ) { // same y
        if( t[0] < h[0] ) {
            return [+1, 0];
        } else {
            return [-1, 0];
        }
    }

    if( (h[0] > t[0]) && (h[1] > t[1]) ) {
        return [+1, +1];
    }

    if( (h[0] > t[0]) && (h[1] < t[1]) ) {
        return [+1, -1];
    }

    if( (h[0] < t[0]) && (h[1] > t[1]) ) {
        return [-1, +1];
    }

    if( (h[0] < t[0]) && (h[1] < t[1]) ) {
        return [-1, -1];
    }

    // assert logic
    throw new Error(`don't know how to move the tail ${t} towards head ${h}`);
}

async function solver(filename, knots) {
    const input = await fs.readFile(filename, { encoding: 'utf8' })

    const moves = {
        //   [ x,  y]
        'R': [+1,  0],
        'U': [ 0, +1],
        'L': [-1,  0],
        'D': [ 0, -1]
    }

    const commands = input
        .split(/\r?\n/)
        .map(c => c.split(' ')) // ['R', '4']
        .map(c => [c[0], parseInt(c[1])]) // ['R', 4]
        .map(c => Array(c[1]).fill(moves[c[0]]))
        .flat()
        ;

    let k = Array(knots).fill([0, 0]);

    let pt = [];

    for(const c of commands) {
        k[0] = [k[0][0] + c[0], k[0][1] + c[1]];

        for(let i=1; i<knots; ++i) {
            const o = compute_offset(k[i-1], k[i]);
            k[i] = [k[i][0] + o[0], k[i][1] + o[1]];
        }
    
        pt.push(k[knots-1]);
    }

    const distinct_points = [...new Set(
        pt.map(p => `${p[0]},${p[1]}`)
    )]

    return distinct_points.length;
}

async function main() {
    try {
        test = await solver('input-test.txt', 2);

        if( test !== 13 ) {
            throw new Error(`test failed ${test}`);
        }

        console.log(
            'a',
            await solver('input.txt', 2)
        );

        console.log(
            'b',
            await solver('input.txt', 10)
        );
    } catch (err) {
        console.log(err);
    }
}

main();