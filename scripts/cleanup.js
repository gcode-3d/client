const { readdirSync, unlinkSync, accessSync, mkdirSync } = require("fs");
const path = require("path");
try {
  var files = readdirSync(path.join(__dirname, "../dist"));
} catch {
  mkdirSync(path.join(__dirname, "../dist"));
  process.exit();
}
files.forEach((file) => {
  unlinkSync(path.join(__dirname, "../dist", file));
});

if (files.length > 0) {
  console.log("Removed " + files.length + " files from an earlier build.");
}
