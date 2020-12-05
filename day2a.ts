import { parseArgs } from './util/parse-args';

interface Input {
  character: string;
  min: number;
  max: number;
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
      min: parseInt(match[1], 10),
      max: parseInt(match[2], 10),
      character: match[3],
      password: match[4],
    };
  }
  }) as [Input[]];

  const matchingPasswords = entries.filter(({ min, max, character, password }) => {
    const count = [...password].filter((char) => char === character).length;
    return count >= min && count <= max;
  }).length;

  console.log(`Valid passwords: ${matchingPasswords}`);
  process.exit(0);
})();
