/* eslint-disable prettier/prettier */

const glob = require('glob');
const lang = require('./langfile-processing');

let newKeys = [];
global.count = 0;

let componentFiles = glob.sync('./components/**/*');
componentFiles.forEach((file) => {
  newKeys = lang.collectLangKeys(file, newKeys, 't');
});

let dataFiles = glob.sync('./data/**/*');
dataFiles.forEach((file) => {
  newKeys = lang.collectLangKeys(file, newKeys, 't');
});

let hookFiles = glob.sync('./hooks/**/*');
hookFiles.forEach((file) => {
  newKeys = lang.collectLangKeys(file, newKeys, 't');
});

let layoutFiles = glob.sync('./layout/**/*');
layoutFiles.forEach((file) => {
  newKeys = lang.collectLangKeys(file, newKeys, 't');
});

let middlewareFiles = glob.sync('./middleware/**/*');
middlewareFiles.forEach((file) => {
  newKeys = lang.collectLangKeys(file, newKeys, 't');
});

let pagesFiles = glob.sync('./pages/**/*');
pagesFiles.forEach((file) => {
  newKeys = lang.collectLangKeys(file, newKeys, 't');
});

let sectionsFiles = glob.sync('./sections/**/*');
sectionsFiles.forEach((file) => {
  newKeys = lang.collectLangKeys(file, newKeys, 't');
});

let srcFiles = glob.sync('./src/**/*');
srcFiles.forEach((file) => {
  newKeys = lang.collectLangKeys(file, newKeys, 't');
});


//write json files
let langFiles = glob.sync('./locales/**/*.json');
langFiles.forEach((file) => {
  lang.writeLangfile(file, newKeys);
});
if(!langFiles.length) console.log(`No language file found. Create your lang files (ex: en/common.json, es/common.json ) in 'locales/'.`);
console.log(`${global.count} new keys added.`);



// let getDirectories = function (src, callback) {
//   glob(src + '/**/*', callback);
// };

// getDirectories('../src', function (err, res) {
//   if (err) {
//     console.log('Error', err);
//   } else {
//     res.forEach((file) => {
//       newKeys = lang.collectLangKeys(file, newKeys);
//     });
//   }
// });

// getDirectories('../resources/views/', function (err, res) {
//   if (err) {
//     console.log('Error', err);
//   } else {
//     res.forEach((file) => {
//       newKeys = lang.collectLangKeys(file, newKeys);
//     });
//   }
// });

