/**
 * Splits table into table of tables
 * @param {*} table table to be splited
 * @param {*} chunkSize maximum size of each sub-table
 * @returns table of table chunks
 */
export function splitTableToChunks(table, maxChunkSize) {
    const result = [];
    let size = 0;
    while (size < table.length) {
        result.push(table.slice(size, size + maxChunkSize));
        size = size + maxChunkSize;
    }
    return result;
}

/**
 * Copies properties from source to destination dictionary for matching keys
 * @param {*} destination dictionary object to be extended
 * @param {*} source dictionary object to copy from
 * @param {*} properties array of properties to copy
 * @returns destination dictionary object
 */
export function extendDictionaryWithProperties(destination, source, properties) {
    Object.keys(source).forEach(key => {
        properties.forEach(prop => {
            if (!!destination[key]) {
                destination[key][prop] = source[key][prop];
            }
        })
    });
    return destination;
}


export const comparer = { 
    currency: function compare(a, b, asc) {
        if (rateEmptyString(a, b) !== undefined) {
            return rateEmptyString(a, b);
        }
        const aValue = Number(a.replace(/(^\$|,)/g, ''));
        const bValue = Number(b.replace(/(^\$|,)/g, ''));
        return asc * (aValue - bValue);
    },
    text: function compare(a, b, asc) {
        if (rateEmptyString(a, b) !== undefined) {
            return rateEmptyString(a, b);
        }
        return asc * a.localeCompare(b);
    }

}

function rateEmptyString(a, b) {
    if (a === '') {
        return 1;
    }
    if (b === '') {
        return -1;
    }
}

