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
    maxBounds: maxBounds,
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
    let canfed_layer = 'convenience'; // initialize with default layer

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
            'fill-color': [
                "interpolate",
                ["linear"],
                ["to-number", ["get", canfed_layer]],
                0, "#003f5c",
                1, "#58508d",
                2, "#bc5090",
                3, "#ff6361",
                4, "#ffa600"
              ],
            'fill-opacity': 0.5
        },
        'layout': {
            'visibility': 'none'
        }
    },
    );

    const dropdownMenuButton = document.getElementById('dropdownMenuButton');


    document.querySelectorAll('.dropdown-item').forEach(link => {
        link.addEventListener('click', (event) => {
            map.setLayoutProperty('canfed', 'visibility', 'visible'); // set layer to visible
            // set chloropleth the the layer that is clicked
            canfed_layer = link.id;
            map.setPaintProperty('canfed', 'fill-color', [
                "interpolate",
                ["linear"],
                ["to-number", ["get", canfed_layer]],
                0, "#003f5c",
                1, "#58508d",
                2, "#bc5090",
                3, "#ff6361",
                4, "#ffa600"
            ]);
            dropdownMenuButton.innerHTML = event.target.innerHTML;
        });
    });

    // DINESAFE

    map.addSource('student_nutritional_sites', {
        type: 'vector',
        url: 'mapbox://bern66.aolwacrf'
    })

    map.addLayer({
        'id': 'student_nutritional_sites',
        'type': 'circle',
        'source': 'student_nutritional_sites',
        'source-layer': 'student_nut_site-1209l8',
        'paint': {
            'circle-radius': 4,
            'circle-color': 'orange',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        }
    });

    map.addSource('community_kitchens', {
        type: 'vector',
        url: 'mapbox://bern66.22so2hsr'
    })

    map.addLayer({
        'id': 'community_kitchens',
        'type': 'circle',
        'source': 'community_kitchens',
        'source-layer': 'comm_kitchen__fmarkets-d290mv',
        'paint': {
            'circle-radius': 4,
            'circle-color': 'pink',
            'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
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

//CANFED interactivity

const turnOffButton = document.getElementById('turnOffButton');
turnOffButton.addEventListener('click', function() {
map.setLayoutProperty('canfed', 'visibility', 'none');
dropdownMenuButton.innerHTML = 'Select Layer';
});


/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/

//Declare arrayy variables for labels and colours
const legendlabels = [
    '0 (Lowest)',
    '1',
    '2',
    '3',
    '4 (Highest)',
];

const legendcolours = [
    '#003f5c',
    '#58508d',
    '#bc5090',
    '#ff6361',
    '#ffa600'
];

//Declare legend variable using legend div tag
const legend = document.getElementById('legend');

//For each layer create a block to put the colour and label in
legendlabels.forEach((label, i) => {
    const color = legendcolours[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the color circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = color; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (color cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend.appendChild(item); //add row to the legend
});
