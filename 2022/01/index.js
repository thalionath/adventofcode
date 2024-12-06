
const fs = require('fs/promises');

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const calories = input
        .split(/\r?\n\r?\n/)
        .map(elf => elf.split(/\r?\n/))
        .map(elf => elf.map(str => parseInt(str)))
        .map(elf => elf.reduce((a, s) => a + s))
        .sort((a, b) => b - a) // descending
        ;

    return {
        max: calories[0],
        top3: calories.slice(0, 3).reduce((a, s) => a + s)
    }
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test.max !== 24000 ) {
            throw new Error('test failed');
        }

        if( test.top3 !== 45000 ) {
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