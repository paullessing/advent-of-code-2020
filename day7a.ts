import { parseArgs } from './util/parse-args';

declare const BagTypeKey: unique symbol;

type BagType = string & {
  [BagTypeKey]: never;
}

interface Rule {
  bagType: BagType;
  nested: {
    quantity: number;
    bagType: BagType;
  }[];
}

const SHINY_GOLD: BagType = 'shiny gold' as BagType;

(async function main() {
  function parseRule(ruleText: string): Rule {
    const regex = /^(.*?) bags contain ((?:.*? bags?(?:, |.$))+)/m;

    const match = ruleText.match(regex);
    if (!match) {
      throw new Error(`Could not match rule: "${ruleText}"`);
    }

    const [, bagType, nestedBags] = match;

    const rule: Rule = {
      bagType: bagType as BagType,
      nested: []
    };

    // Conveniently, "contain no other bags" does not match this regex, so we end up with an empty ruleset, which is what we want
    const nestedBagsRegex = /(\d+) (.*?) bags?(?:, |\.$)/gm;
    let m;
    while ((m = nestedBagsRegex.exec(nestedBags)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      const [, quantityStr, nestedType] = m;
      const quantity = parseInt(quantityStr, 10);

      rule.nested.push({
        quantity,
        bagType: nestedType as BagType,
      });
    }

    return rule;
  }

  const [lines] = await parseArgs({ type: 'lines', lineParser: parseRule }) as [Rule[]];

  const rules = new Map<BagType, Rule>(lines.map((line) => [line.bagType, line]));

  interface CheckStatus { isComplete: boolean, canHold: boolean }
  const checks = new Map<BagType, CheckStatus>();
  const getOrCreateStatus = (bagType: BagType): CheckStatus => {
    if (!checks.has(bagType)) {
      const status: CheckStatus = {
        isComplete: false,
        canHold: false,
      }
      checks.set(bagType, status);
    }
    return checks.get(bagType)!;
  }

  function canHold(bagType: BagType): boolean {
    const status = getOrCreateStatus(bagType);
    if (!status.isComplete) {
      // Recursive depth first search
      const rule = rules.get(bagType)!;
      for (const nested of rule.nested) {
        // console.log('Recursing into', nested.bagType);
        if (nested.bagType === SHINY_GOLD || canHold(nested.bagType)) {
          status.canHold = true;
          break;
        }
      }
      status.isComplete = true;
    }
    // console.log(`Checked ${bagType}: ${status.canHold}`);
    return status.canHold;
  }

  const bagsWhichCanHoldShinyGold = Array.from(rules.keys()).filter(canHold);

  console.log(`Total: ${bagsWhichCanHoldShinyGold.length} bags which can hold a ${SHINY_GOLD} bag`);
  process.exit(0);
})();
