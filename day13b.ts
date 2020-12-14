const nums = '17,x,x,x,x,x,x,x,x,x,x,37,x,x,x,x,x,409,x,29,x,x,x,x,x,x,x,x,x,x,13,x,x,x,x,x,x,x,x,x,23,x,x,x,x,x,x,x,373,x,x,x,x,x,x,x,x,x,41,x,x,x,x,x,x,x,x,19'
  .split(',')
  .map((x, i) => x === 'x' ? null : { i, num: parseInt(x, 10) })
  .filter(x => !!x) as { i: number, num: number }[];

// [1, 2, 3]
//   .map((num, i)=> ({i, num}));
// nums
//   .reduce((acc, curr) => getShared(acc.cycle, acc.offset, curr.num, curr.i), { cycle: 1, offset: 0 });

function getShared(a: number, oa: number, b: number, ob: number): { cycle: number, offset: number } {
  console.log("Trying to find", a, oa, b, ob);
  // const scaleOffset = Math.min(oa, ob);
  //
  // const o = Math.max(oa, ob) - scaleOffset;
  // console.log('Offsets:', o, scaleOffset);

  const [n, on] = (() => a <  b ? [a, oa] : [b, ob])();
  const [m, om] = (() => a >= b ? [a, oa] : [b, ob])();

  for (let i = 0; i < n; i++) {
    if ((i * m + om) % n === on) {
      // console.log(`${i} * ${m} - ${o} % ${n} == 0`, a * b, scaleOffset + i * m - o);
      return { cycle: a * b, offset: i * m - om };
    }
  }
  console.error('Not found: solution', a, oa, b, ob);
  throw new Error('Did not find solution');
}

// foo(3, 1, 5, 2);

function foo(n: number, o_n: number, m: number, o_m: number) {
  // a*n + o_n = b*m + o_m = n*m - x
  // a = (o_m - o_n + b*m) / n (where result is integer)

  for (let b = 0; b < n; b++) {
    if ((b * m + o_m - o_n) % n === 0) {
      console.log(`${b} * ${m} + ${o_m} - ${o_n} % ${n} == 0`);

      const x = n * m - (b * m + o_m);

      console.log(n * m, x);

      return x;
    }
  }
}

foo(3, 1, 5, 2); // 15/8
foo(15, 8, 7, 3); // 105/53
