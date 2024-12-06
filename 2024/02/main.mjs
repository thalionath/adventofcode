import assert from 'node:assert';
import { test, after } from 'node:test';

import fs from 'fs/promises';

test('example part 1', async () => {
  assert.strictEqual(2, await solver1('input.test.txt'));
});

function differenceBetweenConsecutiveElements(array) {
    return array.slice(1).map((v, i) => v - array[i])
}

test('difference between consecutive array elements', () => {
  assert.deepStrictEqual([-1, -2, -2, -1], differenceBetweenConsecutiveElements([ 7, 6, 4, 2, 1 ]));
});

// runs if all tests succeed
after(async () => {
    console.log('🎉 All Tests Completed! Solving...');
    await solvePart1();
});

async function solver1(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    return input
        .split(/\r?\n/)
        .map(line => line.split(' ').map(s => parseInt(s)))
        .map(report => differenceBetweenConsecutiveElements(report))
        .map(report => report.every(e => [1, 2, 3].includes(e)) || report.every(e => [-1, -2, -3].includes(e)))
        .filter(Boolean)
        .length
}

// Final Function to Execute After Tests
async function solvePart1() {
    console.log('part 1', await solver1('input.txt'));
}