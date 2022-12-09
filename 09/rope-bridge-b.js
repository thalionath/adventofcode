
const fs  = require('fs/promises')
    ;

function is_touching(h, t) {
    const xs = [h[0] - 1, h[0] + 0, h[0] + 1]
          ys = [h[1] - 1, h[1] + 0, h[1] + 1]
          ;
    return xs.includes(t[0]) && ys.includes(t[1]);
}

function compute_dt(h, t) {

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

    // sanity
    throw new Error(`don't know how to move the tail ${t} towards head ${h}`);
}

async function solver(filename) {
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

    let h = [0, 0];
    let k = Array(9).fill([0, 0]);

    let pt = [];

    for(const c of commands) {
        h = [h[0] + c[0], h[1] + c[1]];

        let o;
        
        o = compute_dt(h   , k[0]); k[0] = [k[0][0] + o[0], k[0][1] + o[1]];
        o = compute_dt(k[0], k[1]); k[1] = [k[1][0] + o[0], k[1][1] + o[1]];
        o = compute_dt(k[1], k[2]); k[2] = [k[2][0] + o[0], k[2][1] + o[1]];
        o = compute_dt(k[2], k[3]); k[3] = [k[3][0] + o[0], k[3][1] + o[1]];
        o = compute_dt(k[3], k[4]); k[4] = [k[4][0] + o[0], k[4][1] + o[1]];
        o = compute_dt(k[4], k[5]); k[5] = [k[5][0] + o[0], k[5][1] + o[1]];
        o = compute_dt(k[5], k[6]); k[6] = [k[6][0] + o[0], k[6][1] + o[1]];
        o = compute_dt(k[6], k[7]); k[7] = [k[7][0] + o[0], k[7][1] + o[1]];
        o = compute_dt(k[7], k[8]); k[8] = [k[8][0] + o[0], k[8][1] + o[1]];

        pt.push(k[8]);
    }

    dp = [...new Set(
        pt.map(p => `${p[0]},${p[1]}`)
    )]

    return dp.length;
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test !== 1 ) {
            throw new Error(`test failed ${test}`);
        }

        console.log(
            await solver('input.txt')
        );
    } catch (err) {
        console.log(err);
    }
}

main();