
const fs = require('fs/promises');

function parse(m) {
    const lines = m.split(/\r?\n/);

    return {
        id: parseInt(lines[0].slice(6,-1)),
        items: lines[1].slice(18).split(', ').map(e => parseInt(e)),
        op: lines[2].slice(13 + 6),
        div: parseInt(lines[3].slice(21)),
        a: parseInt(lines[4].slice(29)),
        b: parseInt(lines[5].slice(30)),
    }
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const monkies = input
        .split(/\r?\n\r?\n/)
        .map(parse)
        ;

    const common = monkies.map(m => m.div).reduce((a, m) => a * m);

    const ops = {
        '+': (a, b) => a + b,
        '*': (a, b) => a * b
    };

    let handled = Array(monkies.length).fill(0);

    for(let r=0; r<10000; r++) {
        for(let m of monkies) {
            for(let i of m.items) {
                handled[m.id] += 1;
                const op = m.op.replaceAll('old', i).split(' ');
                const r = ops[op[1]](parseInt(op[0]), parseInt(op[2]))
                const wr = r; // Math.trunc(r / 3);
                const d = (wr % m.div) === 0;
                const next = d ? m.a : m.b;
                monkies[next].items.push(wr % common);
            }
            m.items = [];
        }
    }

    const most_active = handled.sort((a, b) => b - a);

    console.log(most_active);

    return most_active[0] * most_active[1];
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test !== 2713310158 ) {
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