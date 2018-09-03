import { fetchData } from '../scripts/data-loader';
import sinon from 'sinon';
import chai from 'chai';

describe('Data Loader', function () {

    const coinListUrl = 'https://min-api.cryptocompare.com/data/all/coinlist';
    let fetchStub;
    let sandbox;
    let responseCoinListOk = {
        json: () => {
            return {
                Response: 'Success',
                Data: {
                    sym1: {
                        CoinName: 'symbol 1',
                        Symbol: 'sym1'
                    },
                    sym2: {
                        CoinName: 'symbol 2',
                        Symbol: 'sym2'
                    },
                    sym3: {
                        CoinName: 'symbol 3',
                        Symbol: 'sym3'
                    },
                }
            }
        }
    };

    function getPricingUrl(symbols) {
        return `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols.join()}&tsyms=USD`;
    }
    
    function getPricingDataResponse(symbols) {
        const body = {
            DISPLAY: {}
        }
        symbols.forEach((symbol) => {
            body.DISPLAY[symbol] = {
                USD: {
                    PRICE: Math.random().toFixed(4),
                    MKTCAP: Math.random().toFixed(4),
                    CHANGE24HOUR: Math.random().toFixed(4)
                }
            }
        });
        return {
            json: () => body,
            getItem: function (symbol, property) {
                return !!this.json().DISPLAY[symbol] ? this.json().DISPLAY[symbol].USD[property] : undefined;
            }
        };
    }

    function verifyResult(data, pricingResponse) {
        data.forEach((item) => {
            const symbol = item.symbol;
            chai.expect(item.name).to.equal(responseCoinListOk.json().Data[symbol].CoinName);
            chai.expect(item.symbol).to.equal(responseCoinListOk.json().Data[symbol].Symbol);
            chai.expect(item.price).to.equal(pricingResponse.getItem(symbol, 'PRICE'));
            chai.expect(item.marketCap).to.equal(pricingResponse.getItem(symbol, 'MKTCAP'));
            chai.expect(item.priceTrend).to.equal(pricingResponse.getItem(symbol, 'CHANGE24HOUR'));
        });
    }

    beforeEach(function () {
        sandbox = sinon.createSandbox();
        global.fetch = (url) => { };
        fetchStub = sandbox.stub(global, 'fetch');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should fetch data when symbols count is less than maxSymbolsInRequest', async () => {
        const pricingResponse = getPricingDataResponse(['sym1', 'sym2', 'sym3']);
        fetchStub.withArgs(coinListUrl).returns(Promise.resolve(responseCoinListOk));
        fetchStub.withArgs(getPricingUrl(['sym1', 'sym2', 'sym3'])).returns(Promise.resolve(pricingResponse));
        
        const data = await fetchData();

        chai.expect(data.length).to.equal(3);
        verifyResult(data, pricingResponse);
    });

    it('should fetch data when symbols count is greater than maxSymbolsInRequest', async () => {
        const pricingResponse1 = getPricingDataResponse(['sym1', 'sym2']);
        const pricingResponse2 = getPricingDataResponse(['sym3']);
        fetchStub.withArgs(coinListUrl).returns(Promise.resolve(responseCoinListOk));
        fetchStub.withArgs(getPricingUrl(['sym1', 'sym2'])).returns(Promise.resolve(pricingResponse1));
        fetchStub.withArgs(getPricingUrl(['sym3'])).returns(Promise.resolve(pricingResponse2));

        const data = await fetchData(2);

        chai.expect(data.length).to.equal(3);
        verifyResult(data.slice(0, 1), pricingResponse1);
        verifyResult(data.slice(2, 2), pricingResponse2);
    });

    it('should fetch data when pricing data is incomplete', async () => {
        const pricingResponse = getPricingDataResponse(['sym1', 'sym2']);
        fetchStub.withArgs(coinListUrl).returns(Promise.resolve(responseCoinListOk));
        fetchStub.withArgs('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=sym1,sym2,sym3&tsyms=USD')
            .returns(Promise.resolve(pricingResponse));

        const data = await fetchData();

        chai.expect(data.length).to.equal(3);
        verifyResult(data, pricingResponse);
    });

    it('should throw error when fetch responded with error', async () => {
        let responseCoinListError = {
            json: () => {
                return {
                    Response: 'Error',
                    Message: 'This is error message'
                }
            },
        }
        let errorMessage = '';
        fetchStub.withArgs(coinListUrl).returns(Promise.resolve(responseCoinListError));

        try {
            await fetchData();
        } catch (error) {
            errorMessage = error;
        }

        chai.expect(errorMessage.toString()).to.include(responseCoinListError.json().Message);
    });

});
