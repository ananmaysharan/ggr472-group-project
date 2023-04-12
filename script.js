mapboxgl.accessToken = 'pk.eyJ1IjoiYW5hbm1heSIsImEiOiJjbDk0azNmY3oxa203M3huMzhyZndlZDRoIn0.1L-fBYplQMuwz0LGctNeiA'

/*--------------------------------------------------------------------
map set up
--------------------------------------------------------------------*/

// Variable set up

let pointData = [];
let mapArray = [];
let labelArray = [];
let labelCollection;
let lineCollection;
let peakHeightCalc = 20000;
let animateState = true;

// Max bounds
const maxBounds = [
    [-79.6772, 43.4400], // SW coords
    [-79.04763, 44.03074] // NE coords
];

// Initialize map
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/light-v11", // custom Mapbox Studio style URL
    center: [-79.37, 43.715], // starting center in [lng, lat]
    zoom: 10,
    maxZoom: 16,
    //maxBounds: maxBounds,
});


/*--------------------------------------------------------------------
adding controls
--------------------------------------------------------------------*/

// Add zoom and rotation controls 
map.addControl(new mapboxgl.NavigationControl());

// Add fullscreen option to the map
map.addControl(new mapboxgl.FullscreenControl());

// Geocoder

// Create geocoder variable, only show Toronto area results
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca",
    place: "Toronto"
});
// Position geocoder on page
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Add event listener for full screen on button click
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.3832, 43.6932],
        zoom: 10,
        essential: true
    });
});

/*--------------------------------------------------------------------
Load external GeoJSONs
--------------------------------------------------------------------*/

// Fetch GeoJSON from URL and store response
fetch('https://raw.githubusercontent.com/ananmaysharan/ggr472-group-project/main/data/visible_minorities.geojson')
    .then(response => response.json())
    .then(response => {
        console.log(response); //Check response in console
        pointData = response; // Store geojson as variable using URL from fetch response
    });


/*--------------------------------------------------------------------
map load
--------------------------------------------------------------------*/

map.on('load', () => {

    /*--------------------------------------------------------------------
    RESOURCES
    --------------------------------------------------------------------*/

    // Dinesafe

    map.addSource('student_nutritional_sites', {
        type: 'vector',
        url: 'mapbox://ananmay.7karw46o'
    })

    map.addLayer({
        'id': 'student_nutritional_sites',
        'type': 'circle',
        'source': 'student_nutritional_sites',
        'source-layer': 'student_nutrition_sites-d4xukj',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#8BD3C7',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'none'
        }
    });

    map.addSource('community_kitchens', {
        type: 'vector',
        url: 'mapbox://ananmay.6onw09pz'
    })

    map.addLayer({
        'id': 'community_kitchens',
        'type': 'circle',
        'source': 'community_kitchens',
        'source-layer': 'community_kitchens-9ltjd5',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#FCCCE5',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'visible'
        }
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
    });

    // Add event listeners for both 'student_nutritional_sites' and 'community_kitchens'
    ['student_nutritional_sites', 'community_kitchens'].forEach(layer => {
        map.on('mouseenter', layer, (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.name;
            const address = e.features[0].properties.address;
            const type = e.features[0].properties.type;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(coordinates).setHTML("<h6>" + name + "</h6>" + "<a href='" + "https://www.google.com/maps/search/?api=1&query=" + coordinates[1] + "," + coordinates[0] + "'>" + address + "</a>" + "<br>" + type).addTo(map);
        });

        map.on('mouseleave', layer, () => {
            map.getCanvas().style.cursor = '';
        });
    });

    // ASCA Food Map Layers

    map.addSource('chinesesupermarkets', {
        'type': 'vector',
        'url': 'mapbox://talhav.0oxcwp9a'

    });
    map.addLayer({
        'id': 'chinesesupermarkets',
        'type': 'circle',
        'source': 'chinesesupermarkets',
        'source-layer': 'Chinese_Supermarkets-28c121',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#BEB9DC',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'none'
        }
    });

    map.addSource('middleeasternsupermarkets', {
        'type': 'vector',
        'url': 'mapbox://talhav.74xqz6l5'
    });

    map.addLayer({
        'id': 'middleeasternsupermarkets',
        'type': 'circle',
        'source': 'middleeasternsupermarkets',
        'source-layer': 'Middle_Eastern_Supermarkets-75bwdv',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#FFEE65',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'none'
        }
    });

    map.addSource('greeenhouses', {
        'type': 'vector',
        'url': 'mapbox://talhav.d6upnobv'
    });

    map.addLayer({
        'id': 'greeenhouses',
        'type': 'circle',
        'source': 'greeenhouses',
        'source-layer': 'greenhouses-aaw1m3',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#B3E061',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'visible'
        }
    });

    map.addSource('freelowcostmeals', {
        'type': 'vector',
        'url': 'mapbox://talhav.1dp28g3w'
    });

    map.addLayer({
        'id': 'freelowcostmeals',
        'type': 'circle',
        'source': 'freelowcostmeals',
        'source-layer': 'Free_Or_Low_Cost_Meal-6zr88t',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#FFB55A',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'visible'
        }
    });

    map.addSource('foodbanks', {
        'type': 'vector',
        'url': 'mapbox://talhav.7mhybwqt'
    });

    map.addLayer({
        'id': 'foodbanks',
        'type': 'circle',
        'source': 'foodbanks',
        'source-layer': 'Food_Banks-3nykfz',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#BD7EBF',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'visible'
        }
    });

    map.addSource('farmersmarkets', {
        'type': 'vector',
        'url': 'mapbox://talhav.dddhkhqd'
    });

    map.addLayer({
        'id': 'farmersmarkets',
        'type': 'circle',
        'source': 'farmersmarkets',
        'source-layer': 'Farmers_Market-dsizul',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#7EB0D5',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'visible'
        }
    });

    map.addSource('communitygardens', {
        'type': 'vector',
        'url': 'mapbox://talhav.7tbz1p5p'
    });

    map.addLayer({
        'id': 'communitygardens',
        'type': 'circle',
        'source': 'communitygardens',
        'source-layer': 'Community_Gardens-27kcls',
        'paint': {
            'circle-radius': 4,
            'circle-color': '#FD7F6F',
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        },
        'layout': {
            'visibility': 'visible'
        }
    });


    // Create a popup, but don't add it to the map yet.
    const popup2 = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    // Add event listeners for both 'places' and 'myLayer'
    ['chinesesupermarkets', 'middleeasternsupermarkets', 'greeenhouses', 'freelowcostmeals', 'foodbanks', 'farmersmarkets', 'communitygardens'].forEach(layer => {
        map.on('mouseenter', layer, (e) => {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.Name;
            const description = e.features[0].properties.description;

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup2.setLngLat(coordinates).setHTML("<h6>" + name + "</h6>" + description).addTo(map);
        });

        map.on('mouseleave', layer, () => {
            map.getCanvas().style.cursor = '';
            popup2.remove();
        });
    });

    /*--------------------------------------------------------------------
EDUCATION 
--------------------------------------------------------------------*/

    // CANFED Layer

    let canfed_layer = 'convenience'; // initialize with default layer

    map.addSource('canfed', {
        type: 'geojson',
        // using a URL for the external geojson to load.
        data: 'https://raw.githubusercontent.com/ananmaysharan/ggr472-group-project/main/data/canfed_cleaned.geojson'
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
            document.getElementById('canfed-legend').style.display = 'block';
            document.getElementById('turnOffButton').style.display = 'block';
        });
    });


    // Turf.js Sociodemographic layers (3D Peaks)

    for (i = 0; i < pointData.features.length; i++) {

        let barHeight = pointData.features[i].properties.Value;
        let barHeightAdj = barHeight / peakHeightCalc;
        let barShuffle = Math.floor(Math.random() * (1000 - 100) + 100) / 500000;

        let peakRandomCentre = barShuffleNum(i, barShuffle, pointData);

        let peakLeftLat = pointData.features[i].geometry.coordinates[1];
        let peakLeftLng = peakRandomCentre - 0.002;

        let peakTopLat = pointData.features[i].geometry.coordinates[1] + barHeightAdj;
        let peakTopLng = peakRandomCentre;

        let peakRightLat = pointData.features[i].geometry.coordinates[1];
        let peakRightLng = peakRandomCentre + 0.002;


        let peakLine = turf.lineString([[peakLeftLng, peakLeftLat], [peakTopLng, peakTopLat], [peakRightLng, peakRightLat]], { height: barHeight });

        let labelPoint = turf.point([peakTopLng, peakTopLat], { height: barHeight });

        mapArray.push(peakLine);
        labelArray.push(labelPoint);

        if (i == pointData.features.length - 1) {
            console.log('done calc');
            lineCollection = turf.featureCollection(mapArray);
            labelCollection = turf.featureCollection(labelArray);
            buildLines(lineCollection, labelCollection);
        }
    }

});

// Turf.js Sociodemographic Functions (3D Peaks)


function barShuffleNum(num, random, layer) {

    if (num % 2 == 0) {
        // console.log('even');
        return layer.features[i].geometry.coordinates[0] + random;
    } else {
        // console.log('odd');
        return layer.features[i].geometry.coordinates[0] - random;
    }

}

function buildLines(lines) {

    // load your geojson
    map.addSource('bars', {
        type: 'geojson',
        lineMetrics: true,
        data: lines
    });

    map.addLayer({
        'id': 'visible_minorities',
        'type': 'line',
        'source': 'bars',
        'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'none'
        },
        'paint': {
            'line-color': '#111',
            'line-width': 1,
            'line-opacity': 0.8,
            'line-gradient': [
                'interpolate',
                ['linear'],
                ['line-progress'],
                0,
                '#fde0dd',
                0.25,
                '#fa9fb5',
                0.5,
                '#c51b8a',
                0.75,
                '#fa9fb5',
                1,
                '#fde0dd'
            ]
        }
    });

}

// CANFED Interactivity

const turnOffButton = document.getElementById('turnOffButton');
turnOffButton.addEventListener('click', function () {
    map.setLayoutProperty('canfed', 'visibility', 'none');
    document.getElementById('canfed-legend').style.display = 'none';
    document.getElementById('turnOffButton').style.display = 'none';
    dropdownMenuButton.innerHTML = 'Select Layer';
});

// Checkbox Interactivity

// Get all the checkboxes
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Iterate over the checkboxes
checkboxes.forEach(function (checkbox) {
    // Add an event listener for each checkbox
    checkbox.addEventListener('change', function () {
        const layerId = this.parentNode.id; // Get the id of the list item
        const layer = map.getLayer(layerId); // Get the layer with the same id as the list item

        // If the checkbox is checked, show the layer; otherwise, hide it
        if (this.checked) {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    });
});


// Radio Interactivity

// Get all the radios
const radios = document.querySelectorAll('input[type="radio"]');

// Iterate over the radios
radios.forEach(function (radio) {
    // Add an event listener for each radio
    radio.addEventListener('change', function () {
        const layerId = this.parentNode.id; // Get the id of the list item
        const layer = map.getLayer(layerId); // Get the layer with the same id as the list item
        // If the checkbox is checked, show the layer; otherwise, hide it
        if (this.checked) {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    });
});

/*--------------------------------------------------------------------
LEGENDS
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
const legend = document.getElementById('canfed-legend');

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



//Declare arrayy variables for labels and colours
const legendlabels2 = [
    'Community Kitchens',
    'Greeenhouses',
    'Free or Low Cost Meal',
    'Foodbanks',
    'Farmers Markets',
    'Community Gardens',
    '',
    'Student Nutritional Sites',
    'Chinese Supermarkets',
    'Middle Eastern Supermarkets',
];

const legendcolours2 = [
    '#FCCCE5',
    '#B3E061',
    '#FFB55A',
    '#BD7EBF',
    '#7EB0D5',
    '#FD7F6F',
    '#FFFFFF',
    '#8BD3C7',
    '#BEB9DC',
    '#FFEE65',
];

//Declare legend variable using legend div tag
const legend2 = document.getElementById('points-legend');

//For each layer create a block to put the colour and label in
legendlabels2.forEach((label, i) => {
    const color = legendcolours2[i];

    const item = document.createElement('div'); //each layer gets a 'row' - this isn't in the legend yet, we do this later
    const key = document.createElement('span'); //add a 'key' to the row. A key will be the color circle

    key.className = 'legend-key'; //the key will take on the shape and style properties defined in css
    key.style.backgroundColor = color; // the background color is retreived from teh layers array

    const value = document.createElement('span'); //add a value variable to the 'row' in the legend
    value.innerHTML = `${label}`; //give the value variable text based on the label

    item.appendChild(key); //add the key (color cirlce) to the legend row
    item.appendChild(value); //add the value to the legend row

    legend2.appendChild(item); //add row to the legend
});



