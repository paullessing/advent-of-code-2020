import { parseArgs } from './util/parse-args';

interface Input {
  character: string;
  firstIndex: number;
  secondIndex: number;
  password: string;
}

(async function main() {
  const [entries] = await parseArgs({ type: 'file', lineParser: (line): Input => {
    const match = line.match(/^(\d+)-(\d+) ([a-z]): (.*)$/i);
    if (!match) {
      console.log(`Could not parse line: ${JSON.stringify(line)}`);
      process.exit(1);
    }
    return {
      firstIndex: parseInt(match[1], 10) - 1,
      secondIndex: parseInt(match[2], 10) - 1,
      character: match[3],
      password: match[4],
    };
  }
  }) as [Input[]];

  const matchingPasswords = entries.filter(({ firstIndex, secondIndex, character, password }) => {
    return (password[firstIndex] === character) !== (password[secondIndex] === character);
  }).length;

  console.log(`Valid passwords: ${matchingPasswords}`);
  process.exit(0);
})();
