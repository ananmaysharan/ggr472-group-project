mapboxgl.accessToken = 'pk.eyJ1IjoidGFsaGF2IiwiYSI6ImNsZG0wdno1MDA0dHMzb2tiNDc5YnFzcm0ifQ.QrkOG_mZti52bYP2Usy-MA'

const map = new mapboxgl.Map({

    container: 'map',

    style: 'mapbox://styles/mapbox/navigation-night-v1',

    center: [-79.39830123888215, 43.664695891060376], 

    zoom: 12,

});