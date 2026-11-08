/**
 * Indexed reads must respect the logical size, not the backing capacity.
 */
var assert = require('assert'),
    FixedDeque = require('../fixed-deque.js'),
    CircularBuffer = require('../circular-buffer.js'),
    Vector = require('../vector.js');

function assertReads(structure, expected) {
  for (var i = 0; i <= structure.capacity + 1; i++)
    assert.strictEqual(structure.get(i), expected[i], 'index ' + i);

  assert.strictEqual(structure.get(Infinity), undefined);
}

[Array, Uint8Array, Float64Array].forEach(function(ArrayClass) {
  [FixedDeque, CircularBuffer].forEach(function(DequeClass) {
    describe(DequeClass.name + ' get bounds with ' + ArrayClass.name, function() {
      it('should hide unused and removed slots.', function() {
        var deque = new DequeClass(ArrayClass, 4);

        assertReads(deque, []);
        deque.push(1);
        deque.push(2);
        assertReads(deque, [1, 2]);
        deque.pop();
        assertReads(deque, [1]);

        deque.clear();
        assertReads(deque, []);
        deque.push(3);
        assertReads(deque, [3]);
      });

      it('should respect the size after wrapping and shifting.', function() {
        var deque = new DequeClass(ArrayClass, 4);

        deque.unshift(1);
        deque.unshift(2);
        deque.push(3);
        deque.push(4);
        assertReads(deque, [2, 1, 3, 4]);

        deque.shift();
        assertReads(deque, [1, 3, 4]);
        deque.shift();
        assertReads(deque, [3, 4]);
        deque.pop();
        assertReads(deque, [3]);
        deque.pop();
        assertReads(deque, []);
      });
    });
  });

  describe('Vector get bounds with ' + ArrayClass.name, function() {
    it('should hide unused and popped slots.', function() {
      var vector = new Vector(ArrayClass, 4);

      assertReads(vector, []);
      vector.push(1);
      vector.push(2);
      assertReads(vector, [1, 2]);
      vector.pop();
      assertReads(vector, [1]);
      vector.pop();
      assertReads(vector, []);
      vector.push(3);
      assertReads(vector, [3]);
    });

    it('should respect the length after shrinking and growing capacity.', function() {
      var vector = Vector.from([1, 2, 3, 4], ArrayClass);

      assertReads(vector, [1, 2, 3, 4]);
      vector.resize(2);
      assertReads(vector, [1, 2]);
      vector.grow(8);
      assertReads(vector, [1, 2]);
      vector.resize(0);
      assertReads(vector, []);
    });
  });
});
