export function initialize(tableId, data) {
    const tableElement = document.getElementById(tableId);
    data.forEach(item => {
        const trElement = document.createElement('tr');
        for (const property in item) {
            if (item.hasOwnProperty(property)) {
                const tdElement = document.createElement('td');
                tdElement.appendChild(document.createTextNode(item[property]));
                trElement.appendChild(tdElement);
            }
        }
        tableElement.appendChild(trElement);
    });
  }
  
