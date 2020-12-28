import { parseArgs } from './util/parse-args';

interface Passport {
  [key: string]: string;
}

const validateYear = (min: number, max: number) => (value: string): boolean => {
  if (!value.match(/^\d{4}$/)) {
    return false;
  }
  const parsed = parseInt(value, 10);
  return parsed >= min && parsed <= max;
}

const requirements: { [key: string]: (value: string) => boolean } = {
  'byr': validateYear(1920, 2002), // (Birth Year) - four digits; at least 1920 and at most 2002.,
  'iyr': validateYear(2010, 2020), // (Issue Year) - four digits; at least 2010 and at most 2020.
  'eyr': validateYear(2020, 2030), // (Expiration Year) - four digits; at least 2020 and at most 2030.
  'hgt': (value) => {
    // (Height) - a number followed by either cm or in:
    //     If cm, the number must be at least 150 and at most 193.
    //     If in, the number must be at least 59 and at most 76.
    const match = value.match(/^(\d+)(cm|in)$/);
    if (!match) {
      return false;
    }
    const height = parseInt(match[1], 10);
    const unit = match[2];
    if (unit === 'cm') {
      return height >= 150 && height <= 193;
    } else {
      return height >= 59 && height <= 76;
    }
  },
  'hcl': (value) => !!value.match(/^#[0-9a-f]{6}$/), // (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  'ecl': (value) => !!~['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(value),
  'pid': (value) => !!value.match(/^\d{9}$/)
  //'cid': // (Country ID) - ignored, missing or not.
};

(async function main() {
  const [lines] = await parseArgs('lines') as [string[]];

  const passports = getPassports(lines);

  console.log(JSON.stringify(passports, null, 2))

  const validPassports = passports
    .filter((passport) => Object.keys(requirements)
      .filter((key) => {
        if (!passport[key]) {
          return true;
        }
        const matched = requirements[key](passport[key]);
        return !matched;
      }).length === 0
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
