import axios from "axios";
import commandLineArgs from "command-line-args";
import dotenv from "dotenv";
import fs from "fs";
import url from "url";

dotenv.config();

const options = commandLineArgs([
  { name: "year", type: Number, defaultValue: Number(process.env.YEAR) },
  { name: "day", type: Number, defaultValue: Number(process.env.DAY) },
  { name: "part", alias: "p", type: Number, defaultValue: 1 },
]);

const { year, day, part } = options;

if (part && ![1, 2].includes(part)) {
  console.error("Invalid Part specified. If present, must be 1 or 2.");
  process.exit(1);
}

console.info(`Submitting answer for ${year} Day ${day} Part ${part}...`);

const { part1, part2 } = require(`../src/day.${day}`);

const getResult = part === 1 ? part1 : part2;
const result = getResult();

const answersPath = `./src/day.${day}.answers.json`;

if (!fs.existsSync(answersPath)) {
  fs.writeFileSync(answersPath, JSON.stringify({ history: [] }));
}

type Answers = {
  history: History[];
};

type History = {
  timestamp: number;
  answer: number | string;
};

const answers: Answers = JSON.parse(fs.readFileSync(answersPath).toString());

if (answers.history.some((x) => x.answer === result)) {
  console.error("This answer was already submitted!");
  process.exit(1);
}

const params = new url.URLSearchParams({ level: part, answer: result });

axios
  .post(
    `https://adventofcode.com/${year}/day/${day}/answer`,
    params.toString(),
    {
      headers: {
        cookie: `session=${process.env.SESSION}`,
      },
    }
  )
  .then((response) => {
    if (response.data.includes("That's not the right answer")) {
      console.error("That's not the right answer.");
    } else {
      console.info("Correct!!");
    }

    answers.history.push({ timestamp: new Date().getTime(), answer: result });
  })
  .catch((error: any) => {
    console.error("Failed to submit answer: ", error.message);
  })
  .finally(() => {
    fs.writeFileSync(answersPath, JSON.stringify(answers));
  });
