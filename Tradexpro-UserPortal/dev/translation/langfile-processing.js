const fs = require('fs');

function collectLangKeys(file, newKeys = [], funcSignature = '__') {
  try {
    let data = '';
    let dataArr = [];
    try {
      data = fs.readFileSync(file).toString();
    } catch {}
    if (data !== '') {
      if (funcSignature === '__') {
        dataArr = [...data.matchAll(/\_\_\([\'|\"](.*?)[\'|\"]\)/g)];
        dataArr = dataArr.concat([
          ...data.matchAll(/\_\_\(\n +[\'|\"](.*?)[\'|\"]\n +\)/g),   //for new line and space
        ]);
        dataArr = dataArr.concat([
          ...data.matchAll(/\_\_ [\'|\"](.*?)[\'|\"] /g),
        ]);
        dataArr = dataArr.concat([
          ...data.matchAll(/\_\_ [\'|\"](.*?)[\'|\"]\}/g),
        ]);
      } else {
        dataArr = [
          ...data.matchAll(
            new RegExp(`[{'|\\" |\\' ]${funcSignature}\\([\\'|\\"](.*?)[\\'|\\"]\\)`, 'g'),
          ),
        ];
        dataArr = dataArr.concat([
          ...data.matchAll(
            new RegExp(`[{'|\\" |\\' ]${funcSignature}\\(\\n +[\\'|\\"](.*?)[\\'|\\"]\\n +\\)`, 'g'),    //for new line and space
          ),
        ]);
        /* dataArr = dataArr.concat([
          ...data.matchAll(
            new RegExp(`${funcSignature}([\\'|\\"](.*?)[\\'|\\"])`, 'g'),
          ),
        ]); */
        /* dataArr = dataArr.concat([
          ...data.matchAll(
            new RegExp(`${funcSignature} [\\'|\\"](.*?)[\\'|\\"]\\}`, 'g'),
          ),
        ]); */
      }

      for (let i = 0; i < dataArr.length; i++) {
        dataArr[i][1] && newKeys.push(dataArr[i][1]);
      }
      return newKeys;
    }
    return newKeys;
  } catch (error) {
    console.log(error.toString());
    return newKeys;
  }
}

async function writeLangfile(file, newKeys = []) {
  try {
    let langKeys = {};
    let data = '';
    try {
      data = fs.readFileSync(file).toString();
    } catch {}
    if (data !== '') {
      langKeys = JSON.parse(data);
    }

    if (newKeys.length) {
      newKeys.forEach((elem) => {
        let found = false;
        for (key in langKeys) {
          elem = elem.replace(/"$/, '');
          elem = elem.replace(/'$/, '');
          if (key === elem) {
            found = true;
            break;
          }
        }
        if (!found) {
          global.count++;
          langKeys[elem] = elem;
        }
      });
    }

    data = JSON.stringify(langKeys);
    data = data.replace('{', '{\n  ');
    data = data.replace('}', '\n}');
    data = data.replace(/","/gi, '",\n  "');

    fs.writeFileSync(file, data);
  } catch (error) {
    console.log(error.toString());
  }
}

module.exports = { collectLangKeys, writeLangfile };

