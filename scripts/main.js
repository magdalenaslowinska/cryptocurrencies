import { initialize as initializeTable, sort as sortTable, filter as filterTable } from './table-control.js';
import { fetchData } from './data-loader.js';

const propertyNames = ['name', 'symbol', 'price', 'marketCap', 'priceTrend'];

setGlobalEvents();
subscribeToEvents();
toggleSpinner(true);

fetchData()
    .then(data => {
        initializeTable('crypto-table', Object.values(data), propertyNames);
        toggleSpinner(false);
    }
    )
    .catch(error => {
        toggleSpinner(false);
        alert(error.message);
    })


function setGlobalEvents() {
    window.sort = sort;
}

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
                if (element.value.trim() === '') {
                    element.classList.remove('active-filter');
                } else {
                    if (element === inputName) {
                        inputSymbol.classList.remove('active-filter');
                        inputSymbol.value = '';
                    } else {
                        inputName.classList.remove('active-filter');
                        inputName.value = '';
                    }
                    element.classList.add('active-filter');
                }
                filterTable('crypto-table', element === inputName ? 0 : 1, element.value);
            }, 400);
        });
    });
}


