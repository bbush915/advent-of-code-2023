import fs from "fs";

import "./utils/array";

type Hand = {
  cards: string[];
  bid: number;
};

enum HandTypes {
  FIVE_OF_A_KIND,
  FOUR_OF_A_KIND,
  FULL_HOUSE,
  THREE_OF_A_KIND,
  TWO_PAIR,
  ONE_PAIR,
  HIGH_CARD,
}

function parseInput() {
  return fs
    .readFileSync("src/day.7.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map<Hand>((x) => {
      const parts = x.split(" ");

      return {
        cards: parts[0].split(""),
        bid: Number(parts[1]),
      };
    });
}

export function part1() {
  const hands = parseInput();
  return getWinnings(hands, getHandType1, false);
}

export function part2() {
  const hands = parseInput();
  return getWinnings(hands, getHandType2, true);
}

function getWinnings(
  hands: Hand[],
  getHandType: (cards: string[]) => HandTypes,
  useJokers: boolean = false
) {
  const cardRanking = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];

  if (useJokers) {
    cardRanking.push(...cardRanking.splice(3, 1));
  }

  return hands
    .map((hand) => ({ ...hand, type: getHandType(hand.cards) }))
    .sort((x, y) => {
      if (x.type === y.type) {
        for (let i = 0; i < 5; i++) {
          if (x.cards[i] !== y.cards[i]) {
            return (
              cardRanking.indexOf(y.cards[i]) - cardRanking.indexOf(x.cards[i])
            );
          }
        }
      }

      return y.type - x.type;
    })
    .map((x, i) => x.bid * (i + 1))
    .sum();
}

function getHandType1(cards: string[]) {
  const cardCountLookup = cards.reduce<Record<string, number>>(
    (lookup, card) => {
      if (!lookup[card]) {
        lookup[card] = 0;
      }

      lookup[card]++;

      return lookup;
    },
    {}
  );

  switch (Object.keys(cardCountLookup).length) {
    case 1: {
      return HandTypes.FIVE_OF_A_KIND;
    }

    case 2: {
      return Object.values(cardCountLookup).includes(4)
        ? HandTypes.FOUR_OF_A_KIND
        : HandTypes.FULL_HOUSE;
    }

    case 3: {
      return Object.values(cardCountLookup).includes(3)
        ? HandTypes.THREE_OF_A_KIND
        : HandTypes.TWO_PAIR;
    }

    case 4: {
      return HandTypes.ONE_PAIR;
    }

    default: {
      return HandTypes.HIGH_CARD;
    }
  }
}

function getHandType2(cards: string[]) {
  const jokerCount = cards.filter((x) => x === "J").length;

  const cardCountLookup = cards
    .filter((x) => x !== "J")
    .reduce<Record<string, number>>((lookup, card) => {
      if (!lookup[card]) {
        lookup[card] = 0;
      }

      lookup[card]++;

      return lookup;
    }, {});

  switch (Object.keys(cardCountLookup).length) {
    case 0:
    case 1: {
      return HandTypes.FIVE_OF_A_KIND;
    }

    case 2: {
      switch (jokerCount) {
        case 0: {
          return Object.values(cardCountLookup).includes(4)
            ? HandTypes.FOUR_OF_A_KIND
            : HandTypes.FULL_HOUSE;
        }

        case 1: {
          return Object.values(cardCountLookup).includes(3)
            ? HandTypes.FOUR_OF_A_KIND
            : HandTypes.FULL_HOUSE;
        }

        case 2:
        case 3: {
          return HandTypes.FOUR_OF_A_KIND;
        }
      }
    }

    case 3: {
      switch (jokerCount) {
        case 0: {
          return Object.values(cardCountLookup).includes(3)
            ? HandTypes.THREE_OF_A_KIND
            : HandTypes.TWO_PAIR;
        }

        case 1:
        case 2: {
          return HandTypes.THREE_OF_A_KIND;
        }
      }
    }

    case 4: {
      return HandTypes.ONE_PAIR;
    }

    default: {
      return HandTypes.HIGH_CARD;
    }
  }
}
