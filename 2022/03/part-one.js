
const fs = require('fs/promises');

// returns common elements in arrays a and b
function intersection(a, b) {
    // a must not contain duplicates
    return [...new Set(a)].filter(e => b.includes(e));
}

function add(a, b) {
    return a + b;
}

function priority(character) {
    const code = character.charCodeAt();
    const A = 'A'.charCodeAt();
    const Z = 'Z'.charCodeAt();
    const a = 'a'.charCodeAt();
    const z = 'z'.charCodeAt();

    if( code < A ) {
        throw new Error('bad character ' + character);
    }

    if( code <= Z ) {
        return code - A + 27;
    }

    if( code < a ) {
        throw new Error('bad character ' + character);
    }

    if( code <= z ) {
        return code - a + 1;
    }

    throw new Error('bad character ' + character);
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    return input
        .split(/\r?\n/)
        .map(line => [line.slice(0, line.length/2), line.slice(line.length/2)])
        .map(c => c.reduce(intersection))
        .map(types => types.map(priority))
        .map(priorities => priorities.reduce(add))
        .reduce(add)
        ;
}

async function main() {
    try {
        if( 27 !== priority('A') || 1 !== priority('a') ) {
            throw new Error('test priority failed');
        }

        test = await solver('input-test.txt');

        if( test !== 157 ) {
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