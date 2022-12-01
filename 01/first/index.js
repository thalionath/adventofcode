
const fs = require('fs/promises');


async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const calories = input
        .split(/\r?\n\r?\n/)
        .map(elf => elf.split(/\r?\n/))
        .map(elf => elf.map(str => parseInt(str)))
        .map(elf => elf.reduce((a, s) => a + s))
        ;

    return Math.max(...calories);
}

async function main() {
    try {
        n = await solver('input-test.txt');

        if( n !== 24000 ) {
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