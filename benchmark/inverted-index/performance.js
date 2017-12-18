var InvertedIndex = require('../../inverted-index.js');
var words = require('lodash/words');
var BIBLE = require('./bible.json');
var QUERIES = 50000;

var DOCS = [];

BIBLE.forEach(function(book) {
  var chapters = book.chapters[0];

  for (var chapter in chapters) {
    for (var verse in chapters[chapter])
      DOCS.push({
        book: book.book,
        chapter: chapter,
        verse: verse,
        text: chapters[chapter][verse]
      });
  }
});

function tokenizeText(text) {
  return words(text).filter(function(word) {
    return word.length > 2;
  }).map(function(word) {
    return word.toLowerCase();
  });
}

function tokenizeDoc(doc) {
  return tokenizeText(doc.text);
}

var index = new InvertedIndex([tokenizeDoc, tokenizeText]),
    i,
    l,
    r;

console.time('Index');
for (i = 0; i < DOCS.length; i++)
  index.add(DOCS[i]);
console.timeEnd('Index');

console.log('Tokens', index.dimension);
console.log('Docs', index.size);

console.time('Query');
for (i = 0; i < QUERIES; i++)
  r = index.query('eye');
console.timeEnd('Query');
console.log(r);
