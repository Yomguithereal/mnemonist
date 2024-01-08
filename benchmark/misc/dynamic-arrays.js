var SIZE = 100000;

function Wrapper() {
  this.array = new Float64Array(SIZE);
}

Wrapper.prototype.set = function(index, value) {
  this.array[index] = value;
};

Wrapper.prototype.get = function(index) {
  return this.array[index];
};

suite('Dynamic Arrays', function() {
  bench('array write', function() {
    var array = new Float64Array(SIZE);

    for (var i = 0; i < SIZE; i++)
      array[i] = i;
  });

  bench('wrapper write', function() {
    var wrapper = new Wrapper();

    for (var i = 0; i < SIZE; i++)
      wrapper.set(i, i);
  });

  bench('array read', function() {
    var array = new Float64Array(SIZE),
        j;

    for (var i = 0; i < SIZE; i++)
      j = array[i];
  });

  bench('wrapper read', function() {
    var wrapper = new Wrapper(),
        j;

    for (var i = 0; i < SIZE; i++)
      j = wrapper.get(i);
  });
});
