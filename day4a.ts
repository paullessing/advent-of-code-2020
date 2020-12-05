import { parseArgs } from './util/parse-args';

interface Passport {
  [key: string]: string;
}

const requiredKeys = [
  'byr', // Birth Year
  'iyr', // Issue Year
  'eyr', // Expiration Year
  'hgt', // Height
  'hcl', // Hair Color
  'ecl', // Eye Color
  'pid', // Passport ID
  //'cid', // Country ID
];

(async function main() {
  const [lines] = await parseArgs('lines') as [string[]];

  const passports = getPassports(lines);

  console.log(JSON.stringify(passports, null, 2))

  const validPassports = passports
    .filter((passport) => requiredKeys
      .filter((key) => !passport[key]).length === 0
    )
    .length;

  console.log(`Valid passports: ${validPassports}`);
  process.exit(0);
})();

function getPassports(lines: string[]): Passport[] {
  let currentPassport: Passport | null = null;

  const passports = [];

  for (const line of lines) {
    if (!line.trim()) {
      if (currentPassport) {
        passports.push(currentPassport);
        currentPassport = null;
      }
      continue;
    }
    if (!currentPassport) {
      currentPassport = {};
    }
    const parts = line.split(/\s+/g);
    for (const part of parts) {
      const match = part.match(/^([a-z]{3}):(.*)$/);
      if (!match) {
        console.log(`Error: Could not parse part: ${JSON.stringify(part)}`);
        process.exit(1);
      }
      currentPassport[match[1]] = match[2];
    }
  }
  if (currentPassport) {
    passports.push(currentPassport);
  }
  return passports;
}
