import { initialize as initializeTable, sort as sortTable } from './table-control.js';
import { fetchData } from './data-loader.js';

const propertyNames = ['name', 'symbol', 'price', 'marketCap', 'priceTrend'];
//     { propertyName: 'name', sortType: 'string' },
//     { propertyName: 'symbol', sortType: 'string' },
//     { propertyName: 'price', sortType: 'currency'},
//     { propertyName: 'marketCap', sortType: ''},
//     { propertyName: 'priceTrend', sortType: 'currency'},
// ];

window.sort = sort;

//initializeTable('crypto-table', [], propertyNames);
//toggleSpinner(false);
toggleSpinner(true);

fetchData().then(
    data => {
        initializeTable('crypto-table', Object.values(data), propertyNames);
        toggleSpinner(false);
    }
)

function toggleSpinner(on) {
    const tableElement = document.getElementById('crypto-table');
    const spinnerElement = document.getElementsByClassName('spinner-container')[0];
    if (on) {
        tableElement.classList.add('hidden');
        spinnerElement.classList.remove('hidden');
    } else {
        tableElement.classList.remove('hidden');
        spinnerElement.classList.add('hidden');
    }
}

export function sort(target, columnIndex) {
    const sortedAsc = target.classList.contains('sorted-asc');
    clearSortingClasses();
    const sortType = target.dataset.sortType; //todo
    
    if (sortedAsc) {
        //sort desc
        target.classList.add('sorted-desc');
        target.classList.remove('sorted-asc');
        sortTable('crypto-table', columnIndex, -1);
    } else {
        //sort asc
        target.classList.remove('sorted-desc');
        target.classList.add('sorted-asc');
        sortTable('crypto-table', columnIndex, 1);
    }
}

function clearSortingClasses() {
    const sortedAscElements = document.getElementsByClassName('sorted-asc');
    const sortedDescElements = document.getElementsByClassName('sorted-desc');
    const sortedElements = [...sortedAscElements, ...sortedDescElements];
    sortedElements.forEach(element => {
        element.classList.remove('sorted-desc');
        element.classList.remove('sorted-asc');
    })
}

