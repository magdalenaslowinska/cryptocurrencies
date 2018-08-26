import chai from 'chai';
import {splitTableToChunks, extendDictionaryWithProperties} from '../scripts/common.js';

describe('splitTableToChunks', function () {
    it('should return table of chunks when chunk size is less than table size', () => {
        const table = [1, 2, 3, 4, 5];
        const result = splitTableToChunks(table, 2);
        chai.expect(result.length).to.equal(3);
        chai.expect(result[0]).to.eql([1, 2]);
        chai.expect(result[1]).to.eql([3, 4]);
        chai.expect(result[2]).to.eql([5]);
    });

    it('should not affect table given as an argument', () => {
        const table = [1, 2, 3, 4, 5];
        const tableCopy = Object.assign([], table);
        splitTableToChunks(table, 2);
        chai.expect(table).to.eql(tableCopy);
    });

    it('should return table of table copy when chunk size is greater or equal table size', () => {
        const table = [1, 2, 3];
        const result1 = splitTableToChunks(table, 5);
        const result2 = splitTableToChunks(table, 3);
        chai.expect(result1).to.eql([table]);
        chai.expect(result2).to.eql([table]);
    });
});

describe('extendDictionaryWithProperties', () => {
    it('should copy matching properties from destination to source object', () => {
        const destObject = {key: {prop3: '789'}};
        const sourceObject = {key: { prop1: '123', prop2: '456'}};
        const result = extendDictionaryWithProperties(destObject, sourceObject, ['prop1', 'prop2']);
        chai.expect(result).to.eql({key: {prop1: '123', prop2: '456', prop3: '789'}});
    });

    it('should skip properties when property key is missing in destination object', () => {
        const destObject = {key123: {prop3: '789'}};
        const sourceObject = {key: { prop1: '123', prop2: '456'}};
        const result = extendDictionaryWithProperties(destObject, sourceObject, ['prop1', 'prop2']);
        chai.expect(result).to.eql(destObject);
    });

});