import { initialize as initializeTable, sort as sortTable, filter as filterTable } from './table-control.js';
import { fetchData } from './data-loader.js';

const propertyNames = ['name', 'symbol', 'price', 'marketCap', 'priceTrend'];
const searchByNameText = 'Search by name';
const searchBySymbolText = 'Search by symbol';

window.sort = sort;
window.clearInput = clearInput;
subscribeToEvents();
// initializeTable('crypto-table', [], propertyNames);
// toggleSpinner(false);
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

function sort(target, columnIndex) {
    const sortedAsc = target.classList.contains('sorted-asc');
    clearSortingClasses();
    const sortType = target.dataset.sort;

    if (sortedAsc) {
        //sort desc
        target.classList.add('sorted-desc');
        target.classList.remove('sorted-asc');
        sortTable('crypto-table', columnIndex, -1, sortType);
    } else {
        //sort asc
        target.classList.remove('sorted-desc');
        target.classList.add('sorted-asc');
        sortTable('crypto-table', columnIndex, 1, sortType);
    }
}

function clearInput(target) {
    if (target.value.indexOf(searchByNameText) > -1 || target.value.indexOf(searchBySymbolText) > -1) {
        target.value = '';
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

function subscribeToEvents() {
    const inputName = document.getElementById('inputName');
    const inputSymbol = document.getElementById('inputSymbol');
    let timeoutId;
    [inputName, inputSymbol].forEach(element => {
        element.addEventListener('keyup', function () {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(function () {
                const emptyFieldText = element === inputName ? searchByNameText : searchBySymbolText;
                if (element.value.trim() === '') {
                    element.value = emptyFieldText;
                    element.classList.remove('active-filter');
                } else {
                    if (element === inputName) {
                        inputSymbol.classList.remove('active-filter');
                        inputSymbol.value = searchBySymbolText;
                    } else {
                        inputName.classList.remove('active-filter');
                        inputName.value = searchByNameText;
                    }
                    // const otherElement = element === inputName ? inputSymbol : inputName;
                    // otherElement.classList.remove('active-filter');
                    element.classList.add('active-filter');
                }
                filterTable('crypto-table', element === inputName ? 0 : 1, element.value, emptyFieldText);
            }, 400);
        });
    });
}


