// require modules
const { createWriteStream, readdirSync, unlinkSync } = require("fs");
const path = require("path");
const archiver = require("archiver");

// create a file to stream archive data to.
const output = createWriteStream(path.join(__dirname, "../dist.zip"));
const archive = archiver("zip", {
  zlib: { level: 9 }, // Sets the compression level.
});

try {
  unlinkSync(path.join(__dirname, "../dist.zip"));
} catch {}
output.on("close", function () {
  console.log("Created dist.zip file.");
});

archive.pipe(output);

archive.directory(path.join(__dirname, "../dist"), false);

archive.finalize();
