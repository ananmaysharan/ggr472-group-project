mapboxgl.accessToken = 'pk.eyJ1IjoidGFsaGF2IiwiYSI6ImNsZG0wdno1MDA0dHMzb2tiNDc5YnFzcm0ifQ.QrkOG_mZti52bYP2Usy-MA'

// max bounds
const maxBounds = [
    [-79.6772, 43.4000], // SW coords
    [-79.04763, 44.03074] // NE coords
];

//initialize map
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/navigation-night-v1", // custom Mapbox Studio style URL
    center: [-79.3832, 43.3432], // starting center in [lng, lat]
    zoom: 7,
    maxBounds:maxBounds,
    //bearing: -17.1,
});


/*--------------------------------------------------------------------
adding controls
--------------------------------------------------------------------*/
//add zoom and rotation controls 
map.addControl(new mapboxgl.NavigationControl());

//add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

//create geocoder variable, only show Toronto area results
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca",
    place: "Toronto"
});

//position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


map.on('load', () => {

    // canfed layer

    map.addSource('canfed', {
        type: 'geojson',
        // using a URL for the external geojson to load.
        data: 'https://raw.githubusercontent.com/ananmaysharan/ggr472-group-project/main/canfed_cleaned.geojson'
    });

    map.addLayer({
        'id': 'canfed',
        'type': 'fill',
        'source': 'canfed', // matching source ID from addSource method
        'paint': {
            'fill-color': '#0080ff', // blue color fill
            'fill-opacity': 0.5
        }
    },
    );

    map.addLayer({
        'id': 'outline',
        'type': 'line',
        'source': 'canfed',
        'layout': {},
        'paint': {
        'line-color': '#184387',
        'line-width': 2
        }
        });

});

//add event listener for full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.3832, 43.6932],
        zoom: 10,
        essential: true
    });
});