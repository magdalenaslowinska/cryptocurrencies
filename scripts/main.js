import { initialize as initializeTable } from './table-control.js';
import { loadCryptoCurrencies } from './data-loader.js';

initializeTable('crypto-table', loadCryptoCurrencies());

