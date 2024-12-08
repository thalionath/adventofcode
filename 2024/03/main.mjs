
import { after } from 'node:test';

import fs from 'fs/promises';

// runs if all tests succeed
after(async () => {
    console.log('🎉 All Tests Completed! Solving...');
    await solvePart1();
});

async function solver1(filename) {
    const input = await fs.readFile(filename, { encoding: 'utf8' });

    return [...input.matchAll(/mul\(([0-9]+),([0-9]+)\)/g)]
      .map(m => m.slice(1,3))
      .map(m => m.map(s => parseInt(s)))
      .map(m => m[0]*m[1])
      .reduce((acc, s) => acc + s)
}

async function solver2(filename) {
  const input = await fs.readFile(filename, { encoding: 'utf8' });

  let e = true;
  let sum = 0;
  let s = 0;
  let a, b;

  const mul = () => {
    if( !e ) { return; }
    sum += parseInt(a) * parseInt(b);
  }

  const on  = () => { e = true ; }
  const off = () => { e = false; }

  for(const i of input) {
    switch (s) {
      case  0: if(i==='d') { s = 1; } else if ( i === 'm' ) { s = 2 } break;
      case  1: if(i==='o') { s = 3; } else { s = 0; } break;
      case  2: if(i==='u') { s = 4; } else { s = 0; } break;
      case  3: if(i==='(') { s = 5; } else if(i==='n') { s = 9; } else { s = 0; } break;
      case  4: if(i==='l') { s = 6; } else { s = 0; } break;
      case  5: if(i===')') { on(); } s = 0; break;
      case  6: if(i==='(') { s = 7; a = ''; } else { s = 0; } break;
      case  7: if(i===',') { s = 8; b = ''; } else if ( i >= '0' && i <= '9' ) { a += i; } else { s = 0; } break; 
      case  8: if(i===')') { s = 0; mul();  } else if ( i >= '0' && i <= '9' ) { b += i; } else { s = 0; } break; 
      case  9: if(i===`'`) { s = 10; } else { s = 0; } break;
      case 10: if(i==='t') { s = 11; } else { s = 0; } break;
      case 11: if(i==='(') { s = 12; } else { s = 0; } break;
      case 12: if(i===')') {  off(); } s = 0; break;
    }
  }

  return sum;
}

// Final Function to Execute After Tests
async function solvePart1() {
    console.log('part 1', await solver1('input.txt'));
    console.log('part 2', await solver2('input.txt'));
}