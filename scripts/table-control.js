
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

    trElements = trElements.sort(function (a, b) {
        let aText = a.cells[columnIndex].textContent.trim();
        let bText = b.cells[columnIndex].textContent.trim();
        if (aText === '') {
            return 1;
        }
        if (bText === '') {
            return -1;
        }
        if (sortType === 'currency') {
            const aValue = Number(aText.replace(/(^\$|,)/g, ''));
            const bValue = Number(bText.replace(/(^\$|,)/g, ''));
            return asc * (aValue - bValue);
        } else {
            return asc * aText.localeCompare(bText);
        }
    });

    for (let i = 0; i < trElements.length; ++i) {
        tBodyElement.appendChild(trElements[i]);
    }
}

