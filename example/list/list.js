import L from 'leaflet';

const listElement = document.getElementById('leafletProps');

function addItem(prop) {
    const itemElement = document.createElement('li');

    itemElement.innerHTML = `${prop.key} <span style="color: #CCC;">(${prop.type})</span>`;

    listElement.appendChild(itemElement);
}

Object.keys(L)
    .sort()
    .map(key => {
        return {
            key,
            type: typeof L[key],
        };
    })
    .forEach(addItem);


