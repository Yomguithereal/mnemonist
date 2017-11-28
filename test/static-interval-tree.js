/* eslint-disable */


/**
 * Mnemonist StaticIntervalTree Unit Tests
 * ========================================
 */
var assert = require('assert'),
    StaticIntervalTree = require('../static-interval-tree.js');

describe('StaticIntervalTree', function() {
  var BASIC_INTERVALS = [
    [20, 36],
    [3, 41],
    [0, 1],
    [29, 99],
    [10, 15]
  ];

  var tree = new StaticIntervalTree(BASIC_INTERVALS);


});
