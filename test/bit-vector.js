/**
 * Mnemonist BitVector Unit Tests
 * ===============================
 */
var assert = require('assert'),
    BitVector = require('../bit-vector.js'),
    obliterator = require('obliterator');

describe('BitVector', function() {

  it('should be possible to create a dynamic bit vector.', function() {
    var vector = new BitVector(74);

    assert.strictEqual(vector.length, 74);
    assert.strictEqual(vector.capacity, 96);
    assert.strictEqual(vector.array.length, 3);
    assert.strictEqual(vector.size, 0);
  });

  it('should be possible to set bits.', function() {
    var vector = new BitVector(17);

    vector.set(13);

    assert.strictEqual(vector.size, 1);
    assert.strictEqual(vector.get(13), 1);
    assert.strictEqual(vector.test(13), true);
    assert.strictEqual(vector.get(2), 0);
    assert.strictEqual(vector.test(2), false);

    vector.set(2);
    assert.strictEqual(vector.size, 2);

    vector.set(2, 0);
    assert.strictEqual(vector.size, 1);
    assert.strictEqual(vector.test(2), false);

    vector.flip(3);
    assert.strictEqual(vector.size, 2);
    assert.strictEqual(vector.test(3), true);

    vector.flip(3);
    assert.strictEqual(vector.size, 1);
    assert.strictEqual(vector.test(3), false);
  });

  it('should count set bits when only last bit is set', function() {
    var set = new BitVector(32);

    set.set(31);

    assert.strictEqual(set.size, 1);
  });

  it('should count set bits', function() {
    var set = new BitVector(32);

    for (let i = 0; i < 32; i++) {
      set.set(i);

      assert.strictEqual(set.size, i + 1);
    }
  });

  it('should count set bits when flipping bits', function() {
    var set = new BitVector(32);

    for (let i = 0; i < 32; i++) {
      set.flip(i);

      assert.strictEqual(set.size, i + 1);
    }
  });

  it('should count set bits when only last bit is reset', function() {
    var set = new BitVector(32);

    set.set(31);
    set.reset(31);

    assert.strictEqual(set.size, 0);
  });

  it('should be possible to reset bits.', function() {
    var vector = new BitVector(4);

    vector.set(0);
    vector.set(1);

    vector.reset(0);
    vector.reset(1);

    assert.strictEqual(vector.get(0), 0);
    assert.strictEqual(vector.get(1), 0);
  });

  it('should be possible to use the rank operator.', function() {
    var vector = new BitVector(8010); // Using 8010 not to have a perfect 32bits seq

    var results = [
      [0, 0],
      [2000, 20],
      [4000, 40],
      [6000, 60],
      [8000, 80]
    ];

    var i, j;

    for (i = 0; i < 8000; i += 100)
      vector.set(i);

    for (i = j = 0; i <= 8000; i += 8000 / 4, j++)
      assert.strictEqual(vector.rank(i), results[j][1]);

    vector = new BitVector(2);

    vector.set(1);

    assert.strictEqual(vector.rank(0), 0);
    assert.strictEqual(vector.rank(1), 0);
    assert.strictEqual(vector.rank(2), 1);
  });

  it('should be possible to use the select operator.', function() {
    var vector = new BitVector(11);
    vector.set(1);
    vector.set(3);
    vector.set(4);
    vector.set(5);
    vector.set(9);
    vector.set(10);

    var zeros = vector.rank(vector.length);
    assert.strictEqual(zeros, 6);

    var results = [null, 1, 3, 4, 5, 9, 10];

    for (var i = 1; i <= zeros; i++)
      assert.strictEqual(vector.select(i), results[i]);
  });

  it('should be possible to iterate over bits.', function() {
    var vector = new BitVector(10);

    vector.set(2);
    vector.set(8);
    vector.set(9);

    var array = [0, 0, 1, 0, 0, 0, 0, 0, 1, 1],
        i = 0;

    vector.forEach(function(bit, j) {
      assert.strictEqual(bit, array[j]);
      assert.strictEqual(j, i++);
    });

    var indexedArray = array.map(function(bit, j) {
      return [j, bit];
    });

    assert.deepStrictEqual(obliterator.take(vector.values()), array);
    assert.deepStrictEqual(obliterator.take(vector.entries()), indexedArray);
  });

  it('length divisible by 32 iteration, issue #117.', function() {
    var set = new BitVector(64);

    var iterator = set.entries();
    var result = iterator.next();
    var counter = 0;

    while (!result.done) {
      assert.deepStrictEqual(result.value, [counter, 0]);
      result = iterator.next();
      counter++;
    }

    assert.strictEqual(counter, set.length);
  });

  it('should return undefined on out-of-bound values.', function() {
    var vector = new BitVector(5);

    assert.strictEqual(vector.get(17), undefined);
    assert.strictEqual(vector.test(17), false);
  });

  it('setting an out-of-bound index should throw.', function() {
    var vector = new BitVector();

    assert.throws(function() {
      vector.set(3);
    }, /bounds/);
  });

  it('should be possible to push values.', function() {
    var vector = new BitVector();

    for (var i = 0; i < 250; i++)
      vector.push(i % 2);

    assert.strictEqual(vector.length, 250);
    assert.strictEqual(vector.capacity, 256);
    assert.strictEqual(vector.array.length, 8);
    assert.strictEqual(vector.get(34), 0);
    assert.strictEqual(vector.get(35), 1);
  });

  it('should be possible to pop values.', function() {
    var vector = new BitVector();

    vector.push(1);
    vector.push(1);

    assert.strictEqual(vector.pop(), 1);
    assert.strictEqual(vector.length, 1);
    assert.strictEqual(vector.pop(), 1);
    assert.strictEqual(vector.length, 0);
    assert.strictEqual(vector.pop(), undefined);
    assert.strictEqual(vector.length, 0);

    vector.push(0);
    vector.push(1);

    assert.strictEqual(vector.get(1), 1);
    assert.strictEqual(vector.length, 2);
  });

  it('should be possible to reallocate.', function() {
    var vector = new BitVector();

    vector.push(1);
    vector.push(1);
    vector.push(1);

    vector.reallocate(35);

    assert.strictEqual(vector.capacity, 64);
    assert.strictEqual(vector.length, 3);

    vector.reallocate(2);

    assert.strictEqual(vector.capacity, 32);
    assert.strictEqual(vector.length, 2);
  });

  it('should be possible to grow the vector.', function() {
    var vector = new BitVector({
      initialCapacity: 2,
      policy: function(capacity) {
        return capacity + 32;
      }
    });

    vector.grow(37);

    assert.strictEqual(vector.capacity, 64);

    vector.grow(37);

    assert.strictEqual(vector.capacity, 64);

    vector.grow();

    assert.strictEqual(vector.capacity, 96);
  });

  it('should be possible to resize the vector.', function() {
    var vector = new BitVector({initialLength: 64});

    vector.resize(20);

    assert.strictEqual(vector.capacity, 64);
    assert.strictEqual(vector.length, 20);

    vector.resize(87);

    assert.strictEqual(vector.capacity, 96);
    assert.strictEqual(vector.length, 87);
  });

  it('should throw if the policy returns an irrelevant size.', function() {
    var vector = new BitVector({
      initialCapacity: 32,
      policy: function(capacity) {
        return capacity;
      }
    });

    assert.throws(function() {
      vector.push(1);
    }, /policy/);
  });

  it('should be possible to use a custom policy.', function() {
    var vector = new BitVector({
      initialCapacity: 30,
      policy: function(capacity) {
        return capacity + 2;
      }
    });

    vector.push(1);
    vector.push(1);
    vector.push(1);

    assert.strictEqual(vector.length, 33);
    assert.strictEqual(vector.capacity, 64);
  });

  it('should be possible to export to JSON.', function() {
    var set = new BitVector({initialCapacity: 64, initialLength: 10});
    set.set(2);
    set.set(8);
    set.set(9);

    assert.deepStrictEqual(set.toJSON(), [772]);
  });
});
