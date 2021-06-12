const { readdirSync, unlinkSync } = require("fs");
const path = require("path");

let files = readdirSync(path.join(__dirname, "../dist"));

files.forEach((file) => {
  unlinkSync(path.join(__dirname, "../dist", file));
});

if (files.length > 0) {
  console.log("Removed " + files.length + " files from an earlier build.");
}
