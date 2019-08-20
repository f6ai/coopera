/* eslint-disable */

// const loc = JSON.parse(document.getElementById('map').dataset.location);
// console.log(loc);
// const lat = loc.coordinates[0];
// const lng = loc.coordinates[1];
// const location = [loc.coordinates[1], loc.coordinates[0]];

export const displayMap = (loc) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZjZhaSIsImEiOiJjanppZ2JhczYxNWNuM2x0NjQ5MWFwcTQzIn0.ribsKW6s8cM5O03vvcjtmQ';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/f6ai/cjzight4k01031cr37j2rjxa8',
        center: loc,
        zoom: 7
    });
    
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';
    // add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc).addTo(map);
};
