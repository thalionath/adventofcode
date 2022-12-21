
const fs = require('fs/promises');

function find(map, character) {
    const xs = map.map(row => row.findIndex(e => e === character));
    const y = xs.findIndex(x => x >= 0);
    return { x: xs[y], y: y, steps: 0 };
}

function equal_pos(a, b) {
    return (a.x === b.x) && (a.y === b.y);
}

function elevation(character) {
    return character.charCodeAt(0) - 'a'.charCodeAt(0);
}

function climbable(map, s, d) {
    return (elevation(map[d.y][d.x]) - elevation(map[s.y][s.x])) < 2;
}

function bfs(map, S, E) {
    const width = map[0].length, height = map.length;
    let queue = [S];
    let explored = Array(height).fill(0).map(e => Array(width).fill(false));
    explored[S.y][S.x] = true;
    while( queue.length > 0 ) {
        const v = queue.shift();
        if( equal_pos(v, E) ) {
            return v.steps;
        }

        const adjacent = [
            { x: v.x + 0, y: v.y + 1, steps: v.steps + 1 },
            { x: v.x + 0, y: v.y - 1, steps: v.steps + 1 },
            { x: v.x + 1, y: v.y + 0, steps: v.steps + 1 },
            { x: v.x - 1, y: v.y + 0, steps: v.steps + 1 },
        ]
        .filter(p => (p.x >= 0) && (p.x < width) && (p.y >= 0) && (p.y < height))
        .filter(p => climbable(map, v, p))
        .filter(p => (explored[p.y][p.x] === false))
        ;

        for(const p of adjacent) {
            explored[p.y][p.x] = true;
            queue.push(p);
        }
    }

    return -1;
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const map = input
        .split(/\r?\n/)
        .map(line => line.split(''))
        ;

    const S = find(map, 'S');
    const E = find(map, 'E');

    map[S.y][S.x] = 'a';
    map[E.y][E.x] = 'z';

    const as = map.map((row, y) => row.map((h, i) => h === 'a' ? i : -1).filter(x => x >= 0).map(x => ({ x: x, y: y, steps: 0 }))).flat();

    const closest_a = Math.min(...as.map(a => bfs(map, a, E)).filter(d => d >= 0));

    return {
        a: bfs(map, S, E),
        b: closest_a,
    };
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test.a !== 31 ) {
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