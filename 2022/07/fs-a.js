
const fs  = require('fs/promises')
    , lib = require('./lib.js')
    ;

async function solver(filename) {
    const root = lib.parse_tree(
        await fs.readFile(filename, { encoding: 'utf8' })
    );

    let s = 0;

    lib.walk_tree(root, d => { 
        if( d.size < 100000 ) { s += d.size }
    });

    return s;
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test !== 95437 ) {
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