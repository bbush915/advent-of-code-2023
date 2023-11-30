import commandLineArgs from "command-line-args";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const options = commandLineArgs([
  { name: "day", type: Number, defaultValue: Number(process.env.DAY) },
]);

const { day } = options;

console.info(`Generating Day ${day} files from template...`);

const codeTemplate = fs
  .readFileSync("./src/templates/day.template.txt")
  .toString()
  .replace(/\$\$DAY\$\$/g, day);

const specTemplate = fs
  .readFileSync("./src/templates/day.spec.template.txt")
  .toString()
  .replace(/\$\$DAY\$\$/g, day);

try {
  fs.writeFileSync(`./src/day.${day}.ts`, codeTemplate);
  fs.writeFileSync(`./src/day.${day}.spec.ts`, specTemplate);

  console.info("Created files successfully!");
} catch (error: any) {
  console.error("Failed to create files: ", error.message);
}
