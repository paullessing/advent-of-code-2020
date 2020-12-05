import fs from 'fs-extra';

export type Argument = 'int' | 'lines' | 'file' | { type: 'lines', lineParser?: (line: string, lineNumber: number, lines: string[]) => any };

export async function parseArgs(...argConfigs: Argument[]): Promise<(string | any)[]> {
  const [,, ...args] = process.argv;

  return await Promise.all(argConfigs.map(async (config, i) => {
    if (config === 'int') {
      return parseInt(args[i], 10);
    }
    if (isType('file', config) || isType('lines', config)) {
      const fileData = (await fs.readFile(args[i])).toString();

      if (isType('lines', config)) {
        const lineParser = typeof config === 'object' && config.lineParser || null;
        const lines = fileData.split(/\r?\n/);
        if (!lines[lines.length - 1]) {
          // Remove last line if it is empty
          lines.splice(lines.length - 1, 1);
        }
        return lineParser ? lines.map(lineParser) : lines;
      } else {
        return fileData;
      }
    }
    return '';
  }));
}

function isType<T extends string>(type: T, object: string | { type: string }): object is T | { type: T } {
  return object === type || typeof object === 'object' && object.type === type;
}
