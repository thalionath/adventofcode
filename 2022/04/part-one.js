
const fs = require('fs/promises');

// [3, 5] => [3, 4, 5]
function expand(range) {
    return Array(range[1]-range[0]+1).fill().map((e, i) => i + range[0])
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    return input
        .split(/\r?\n/)
        .map(line => line.split(','))
        .map(
            pair => pair.map(
                range => range.split('-').map(n => parseInt(n))
            )
            .map(expand)
            .sort((a, b) => a.length - b.length)
            .reduce((a, b) => a.every(e => b.includes(e)))
        )
        .filter(e => e === true)
        .length
        ;
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test !== 2 ) {
            throw new Error('test failed');
        }

        console.log(
            await solver('input.txt')
        );
    } catch (err) {
        console.log(err);
    }
}

main();