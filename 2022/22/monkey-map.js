
const fs = require('fs/promises');


async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const [map_string, path_string] = input.split(/\r?\n\r?\n/);

    const map_lines = map_string.split(/\r?\n/);

    const width = Math.max(...map_lines.map(line => line.length));
    const height = map_lines.length;

    const map = map_lines
        .map(l => l.length < width ? l + ' '.repeat(width - l.length) : l)
        .map(l => l.split(''))
        ;

    const path = [...path_string.matchAll(/([0-9]+)(R|L|$)/g)].map(m => ({steps: m[1], turn: m[2]}));

    const right = 0;
    const down  = 1;
    const left  = 2;
    const up    = 3;

    let facing = right;

    let p = {
        x: map_lines[0].indexOf('.'), // start is always an open tile
        y: 0
    };

    const turn = function(f, d) {
        return [
            { R: down , L: up    },
            { R: left , L: right },
            { R: up   , L: down  },
            { R: right, L: left  }
        ][f][d];
    }

    // the next map coordinate, wraps around
    const next = function(p, f) {
        const d = [
            { x: +1, y:  0 },
            { x:  0, y: +1 },
            { x: -1, y:  0 },
            { x:  0, y: -1 }
        ][f];
        return {
            x: ((p.x + d.x) + width ) % width ,
            y: ((p.y + d.y) + height) % height,
        }
    };

    const next_on_map = function(p, facing) {
        let n = next(p, facing);
        // skip the void
        while(map[n.y][n.x] === ' ') {
            n = next(n, facing);
        }
        // console.log(p, n, map[p.y][p.x]);
        return n;
    }

    const step = function(cnt) {
        for(let i = 0; i < cnt; ++i) {
            const n = next_on_map(p, facing), 
                  t = map[n.y][n.x];
            switch(t) {
                case '#': return i;
                case '.': p = n; break;
                default: throw new Error(`unexpected tile '${t}' @ ${n.x},${n.y}`)
            }
        }
        return cnt;
    }

    console.log(width, height, p, path);

    for(const e of path) {
        const p1 = p;
        const s = step(e.steps);
        console.log(`moved from ${p1.x}, ${p1.y} to ${p.x}, ${p.y} in ${s}/${e.steps}`);
        if( e.turn !== '' ) {
            facing = turn(facing, e.turn);
        }
    }


    return 1000 * (p.y + 1) + 4 * (p.x + 1) + facing;
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test !== 6032 ) {
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