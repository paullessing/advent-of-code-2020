import fs from 'fs-extra';

export type Argument = 'file' | { type: 'file', lineParser?: (line: string, lineNumber: number, lines: string[]) => any };

export async function parseArgs(...argConfigs: Argument[]): Promise<(string | any)[]> {
  const [,, ...args] = process.argv;

  return await Promise.all(argConfigs.map(async (config, i) => {
    if (config === 'file' || config.type === 'file') {
      const fileData = (await fs.readFile(args[i])).toString();
      if (typeof config === 'object' && config.lineParser) {
        const lines = fileData.split('\n');
        if (!lines[lines.length - 1]) {
          // Remove last line if it is empty
          lines.splice(lines.length - 1, 1);
        }
        return lines.map(config.lineParser);
      } else {
        return fileData;
      }
    }
    return '';
  }));
}
