import { comparer } from './common.js';

export function initialize(tableId, data, propertyNames) {
    const tbodyElement = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    data.forEach(item => {
        const trElement = document.createElement('tr');
        propertyNames.forEach(property => {
            const tdElement = document.createElement('td');
            if (item.hasOwnProperty(property)) {
                tdElement.appendChild(document.createTextNode(item[property]));
            }
            trElement.appendChild(tdElement);
        })
        tbodyElement.appendChild(trElement);
    });
}

export function sort(tableId, columnIndex, asc, sortType) {
    const tBodyElement = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    let trElements = Array.prototype.slice.call(tBodyElement.rows, 0);
    let fragment = document.createDocumentFragment();
    trElements = trElements.sort(function (a, b) {
        let aText = a.cells[columnIndex].textContent.trim();
        let bText = b.cells[columnIndex].textContent.trim();
        return comparer[sortType](aText, bText, asc);
    });

    for (let i = 0; i < trElements.length; i++) {
        fragment.appendChild(trElements[i]);
    }
    tBodyElement.appendChild(fragment);
}


export function filter(tableId, columnIndex, filter) {
    const tableBody = document.getElementById(tableId).getElementsByTagName('tbody')[0];
    const trElements = tableBody.getElementsByTagName("tr");
    for (let i = 0; i < trElements.length; i++) {
        const cellContent = trElements[i].cells[columnIndex].textContent.toUpperCase();
        if (cellContent.indexOf(filter.toUpperCase()) > -1) {
            trElements[i].classList.remove('hidden');
        } else {
            trElements[i].classList.add('hidden');
        }
    }
}

