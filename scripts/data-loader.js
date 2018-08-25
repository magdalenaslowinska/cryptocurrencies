
const chunkSize = 50;

export function fetchData() {

    return new Promise((resolve, reject) => {
        let namesAndSymbols = [];
        fetch('https://min-api.cryptocompare.com/data/all/coinlist')
            .then(response => {
                return response.json();
            })
            .then(body => {
                if (body.Response === 'Success') {
                    return getNamesAndSymbols(body.Data);
                } else {
                    reject('Error message');
                }
            })
            .then(result => {
                namesAndSymbols = result;
                return getPricingInfo(Object.keys(result));
            })
            .then(results => {
                const pricing = Object.assign([], ...results);
                resolve(
                    extendWithPriceProperties(namesAndSymbols, pricing)
                );
            });
    });
}

function extendWithPriceProperties(obj, src) {
    Object.keys(src).forEach(key => {
        obj[key].price = src[key].price;
        obj[key].marketCap = src[key].marketCap;
        obj[key].priceTrend = src[key].priceTrend;
    });
    return obj;
}

function getNamesAndSymbols(data) {
    const result = [];
    for (const item in data) {
        result[data[item].Symbol] =
            {
                name: data[item].CoinName,
                symbol: data[item].Symbol
            };
    }
    return result;
}

function parsePricingData(data) {
    const result = [];
    for (const symbol in data) {
        result[symbol] = {
            price: data[symbol]['USD'].PRICE,
            marketCap: data[symbol]['USD'].MKTCAP,
            priceTrend: data[symbol]['USD'].CHANGE24HOUR,
        };
    }
    return result;
}

function getPricingInfo(symbols) {
    const symbolChunks = splitToChunks(symbols);
    return Promise.all(symbolChunks.map(chunk => fetchPricingDataChunk(chunk)));
}


function splitToChunks(symbols) {
    const result = [];
    let size = 0;
    while (size < symbols.length) {
        result.push(symbols.slice(size, size + chunkSize));
        size = size + chunkSize;
    }
    return result;
}

function fetchPricingDataChunk(symbols, result) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols.join()}&tsyms=USD`;
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                return response.json();
            })
            .then(body => {
                resolve(parsePricingData(body.DISPLAY));
            });
    });
}