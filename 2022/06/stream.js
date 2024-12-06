
const fs = require('fs/promises');

function detector(input, len) {
    for(let i = 0; i < (input.length - len); ++i) {
        if( new Set(input.slice(i, i + len)).size === len) {
            return i + len;
        }
    }
}

async function main() {
    try {
        const tests = [
            {input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'   , len:  4, expected:  7 },
            {input: 'bvwbjplbgvbhsrlpgdmjqwftvncz'     , len:  4, expected:  5 },
            {input: 'nppdvjthqldpwncqszvftbrmjlhg'     , len:  4, expected:  6 },
            {input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', len:  4, expected: 10 },
            {input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw' , len:  4, expected: 11 },
            {input: 'mjqjpqmgbljsphdztnvjfqwrcgsmlb'   , len: 14, expected: 19 },
        ];

        for( t of tests ) {
            const actual = detector(t.input, t.len)

            if( actual !== t.expected ) {
                throw new Error(`test failed, expected ${t.expected}, got ${actual}`);
            }
        }

        const input = await fs.readFile('input.txt', { encoding: 'utf8' });

        console.log(
            detector(input, 4),
            detector(input, 14)
        );
    } catch (err) {
        console.log(err);
    }
}

main();