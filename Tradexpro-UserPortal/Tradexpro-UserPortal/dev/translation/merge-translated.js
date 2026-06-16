const fs = require('fs');
const keys = JSON.parse(fs.readFileSync('./dev/translation/key.json').toString());
const values = JSON.parse(fs.readFileSync('./dev/translation/value.json').toString());
const result = {};
for( let i = 0; i < keys.length; i++) {
  result[keys[i]] = values[i];
}
data = JSON.stringify(result);
data = data.replace('{', '{\n  ');
data = data.replace('}', '\n}');
data = data.replace(/","/gi, '",\n  "');
fs.writeFileSync("./dev/translation/result.json", data);