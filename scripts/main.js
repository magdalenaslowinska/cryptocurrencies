import { initialize as initializeTable } from './table-control.js';
import { fetchData } from './data-loader.js';

fetchData().then(
    data => {
        initializeTable('crypto-table', Object.values(data));
    }
)

