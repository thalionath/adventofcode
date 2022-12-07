
const fs = require('fs/promises');

function transpose(m) {
    return m[0].map((_, column) => m.map(row => row[column]));
}

function CrateMover9000(stacks, cmd) {
    for( let i = 0; i < cmd.n; ++i ) {
        const p = stacks[cmd.src].pop();
        stacks[cmd.dst].push(p);
    }
}

function CrateMover9001(stacks, cmd) {
    const p = stacks[cmd.src].splice(-cmd.n, cmd.n);
    stacks[cmd.dst].push(...p);
}

async function solver(filename, crane) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const parts = input.split(/\r?\n\r?\n/);

    const stacks =
        transpose(
            parts[0]
                .split(/\r?\n/)
                .reverse()
                .slice(1)
                .map(line => line.match(/.{1,4}/g))
                .map(m => m.map(e => e[1]))
        )
        .map(s => s.filter(e => e !== ' '))
        ;

    const cmds = parts[1]
        .split(/\r?\n/)
        .map(line => line.match(/(\d+) from (\d+) to (\d+)/).slice(1, 4))
        .map(cmd => cmd.map(str => parseInt(str)))
        .map(cmd => ({ n: cmd[0], src: cmd[1]-1, dst: cmd[2]-1 }))
        ;

    for( const cmd of cmds ) {
        crane(stacks, cmd);
    }

    return stacks.reduce((a, s) => a + s.slice(-1), '');
}

async function main() {
    try {
        const parts = [
            {part: 'a', crane: CrateMover9000, expected: 'CMZ' },
            {part: 'b', crane: CrateMover9001, expected: 'MCD' },
        ];

        for( p of parts ) {
            const actual = await solver('input-test.txt', p.crane);

            if( actual !== p.expected ) {
                throw new Error('test failed');
            }

            console.log(
                p.part,
                await solver('input.txt', p.crane)
            );
        }
    } catch (err) {
        console.log(err);
    }
}

main();