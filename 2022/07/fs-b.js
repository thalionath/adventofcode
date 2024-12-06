
const fs  = require('fs/promises')
    , lib = require('./lib.js')
    ;

async function solver(filename) {
    const root = lib.parse_tree(
        await fs.readFile(filename, { encoding: 'utf8' })
    );

    const f = 30000000 - (70000000 - root.size);

    let candidates = [];

    lib.walk_tree(root, d => {
        if( d.size >= f ) { candidates.push(d); }
    });

    const big_enough = candidates.sort((a, b) => a.size - b.size);

    return big_enough[0].size;
}

async function main() {
    try {
        test = await solver('input-test.txt');

        if( test !== 24933642 ) {
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