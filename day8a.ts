import { parseArgs } from './util/parse-args';

interface Instruction {
  type: 'acc' | 'jmp' | 'nop';
  value: number;
}

function parseInstruction(line: string): Instruction {
  const match = line.match(/^(acc|jmp|nop) ((?:\+|\-)\d+)$/);
  if (!match) {
    throw new Error(`Failed to match line: "${line}"`);
  }
  const [, typeStr, valueStr] = match;

  return {
    type: typeStr as 'acc' | 'jmp' | 'nop',
    value: parseInt(valueStr, 10),
  };
}

(async function main() {
  const [instructions] = await parseArgs({ type: 'lines', lineParser: parseInstruction }) as [Instruction[]];

  let acc = 0;
  const visitedLines = new Set<number>();
  let currentLine = 0;

  while (!visitedLines.has(currentLine) && currentLine < instructions.length) {
    visitedLines.add(currentLine);
    const instruction = instructions[currentLine];
    switch (instruction.type) {
      case 'acc':
        acc += instruction.value;
        currentLine++;
        break;
      case 'jmp':
        currentLine += instruction.value;
        break;
      case 'nop':
        currentLine++;
        break;
      default:
        throw new Error(`Unexpected operation "${instruction.type}" on line ${currentLine}`);
    }
  }

  console.log(`Repeated line: ${currentLine}, Accumulator value: ${acc}`)
  process.exit(0);
})();
