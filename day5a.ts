import { parseArgs } from './util/parse-args';

function convertBinaryToNumeric(value: string): number {
  const binary = value.replace(/[BR]/gi, '1').replace(/[FL]/gi, '0');
  return parseInt(binary, 2);
}

(async function main() {
  const [lines] = await parseArgs({ type: 'lines', lineParser: convertBinaryToNumeric }) as [number[]];

  const maxSeatId = Math.max.apply(null, lines);

  console.log(`Maximum Seat ID: ${maxSeatId}`);
  process.exit(0);
})();
