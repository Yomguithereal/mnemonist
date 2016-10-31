function ObjectQueue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = {};
}

ObjectQueue.prototype.size = function() {
    return this._newestIndex - this._oldestIndex;
};

ObjectQueue.prototype.enqueue = function(data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

ObjectQueue.prototype.dequeue = function() {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;

    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;

        return deletedData;
    }
};

module.exports = ObjectQueue;
