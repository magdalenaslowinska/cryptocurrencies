import { splitTableToChunks, extendDictionaryWithProperties } from './common.js';

export function fetchData(maxSymbolsInRequest = 50) {
    let namesAndSymbols = [];
    return fetch('https://min-api.cryptocompare.com/data/all/coinlist')
        .then(response => {
            return response.json();
        })
        .then(body => {
            if (body.Response === 'Error') {
                throw new Error(`Incorrect respose status: ${body.Message}`);
            }
            return getNamesAndSymbols(body.Data);
        })
        .then(result => {
            namesAndSymbols = result;
            return Promise.all(splitTableToChunks(Object.keys(result), maxSymbolsInRequest).map(
                chunk => fetchPricingDataChunk(chunk)));
        })
        .then(results => {
            const pricing = Object.assign([], ...results);
            const finalResult = extendDictionaryWithProperties(
                namesAndSymbols, pricing, ['price', 'marketCap', 'priceTrend']);
            return Object.values(finalResult);
        });
}

function fetchPricingDataChunk(symbols) {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols.join()}&tsyms=USD`;
    return fetch(url)
        .then(response => {
            return response.json();
        })
        .then(body => {
            if (body.Response === 'Error') {
                throw new Error(`Incorrect respose status: ${body.Message}`);
            }
            return getPricingData(body.DISPLAY);
        });
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

function getPricingData(data) {
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
