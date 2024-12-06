
const fs = require('fs/promises');

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    const lookup = {
        AX: 4,
        AY: 8,
        AZ: 3,
        BX: 1,
        BY: 5,
        BZ: 9,
        CX: 7,
        CY: 2,
        CZ: 6,
    };

    return input
        .split(/\r?\n/)
        .map(line => line.split(' ').join(''))
        .map(key => lookup[key])
        .reduce((a, s) => a + s)
        ;
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test !== 15 ) {
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