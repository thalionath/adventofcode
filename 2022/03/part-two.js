
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
        throw new Error('bad character' + character);
    }

    if( code <= Z ) {
        return code - A + 27;
    }

    if( code < a ) {
        throw new Error('bad character' + character);
    }

    if( code <= z ) {
        return code - a + 1;
    }

    throw new Error('bad character' + character);
}

// [1, 2, 3, 4, 5, 6, 7].reduce(group_by(3), [])
// => [[1, 2, 3], [4, 5, 6], [..]]
function group_by(n) {
    return (a, e, i) => {
        if( i % n === 0 ) {
            a.push([e]);
        } else {
            a[a.length - 1].push(e);
        }
        return a;
    }
}

async function solver(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    return input
        .split(/\r?\n/)
        .reduce(group_by(3), [])
        .map(g => g.reduce(intersection))
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

        if( test !== 70 ) {
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