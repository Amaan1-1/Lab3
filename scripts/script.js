mapboxgl.accessToken = 'pk.eyJ1IjoiYW1hYW5iIiwiYSI6ImNtbGRkZW1meDFhdjMzZXEzb25ydDQwNXUifQ.9X7LgD4vFHgfHOLKdon0jg'; 
//My access token from mapbox

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/amaanb/cmlfrw1us00ho01qq1aad4yvb', //style URL
    center: [-79.65, 43.61], // starting position [lng, lat] changed to be centered around Mississuaga
    zoom: 10.4, // starting zoom to fit all points
    bearing: -45,
}); 

//Load map
map.on('load', () => {

    // Adding a source for City Landmarks that accesses the City_Landdmarks.geojson
    //This file contains locations of landmarks in Missisauga including schools
    map.addSource('City_Landmarks', {
        type: 'geojson',
        data: '../data/City_Landmarks.geojson'
    });

    // Adding map controls for geocoding and navigation
    map.addControl(
    new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            countries: "ca" // Try searching for places inside and outside of canada to test the geocoder
        })
    );

    // Add zoom and rotation controls in the map interface
    map.addControl(new mapboxgl.NavigationControl());
    //Full Screen control
    map.addControl(new mapboxgl.FullscreenControl());
    // Add button to reset map view to the default position and zoom
    resetButton(map, "reset-btn");

    //Display longitude and latitude of current position
    LatLngDisplay(map);

    // Since the data layer has all city landmarks, we will add a layer to the map 
    // that filters to only show Public Secondary schools
    addLayer(map, 'Public_Secondary_Schools', 'Schools, Public Secondary', '#4000ff');
    addLayer(map, 'Catholic_Secondary_Schools', 'Schools, Cath. Secondary', '#09e514');

    // Popups will display the cleaned school name and address when clicked.
    addPopup(map, 'Public_Secondary_Schools');
    addPopup(map, 'Catholic_Secondary_Schools');


    // Create legend for school categories with matching colors
    const legenditems = [
        { label: 'Public Secondary Schools', colour: '#4000ff' },
        { label: 'Catholic Secondary Schools', colour: '#09e514' },
    ];


    // For each array item create a row to put the label and colour in
    legenditems.forEach(({ label, colour }) => {

        // Create a container row for the legend item
        const row = document.createElement('div'); 
        // create span for colour circle
        const colcircle = document.createElement('span'); 

        // the colcircle will take on the shape and style properties defined in css
        colcircle.className = 'legend-colcircle'; 
        // a custom property is used to take the colour from the array and apply it to the css class
        colcircle.style.setProperty('--legendcolour', colour); 

        // Create span element for legend label text
        const text = document.createElement('span'); 
        text.textContent = label; // set text variable to tlegend label value in array

        // Add an interactive button for toggling layer visibility
        const button = document.createElement('button');
        button.textContent = 'Hide';
        button.className = "hide_button";
        let layerId = "";

        // Match the button to the correct map layer based on the school type
        if(label === "Public Secondary Schools"){
            button.id = "Public_School_Button";
            layerId = "Public_Secondary_Schools";
        }
        else{
            button.id = "Catholic_School_Button";
            layerId = "Catholic_Secondary_Schools";
        }

        // Append each legend item (circle, text, button) to the container
        row.append(colcircle, text, button); 
        legend.appendChild(row); // Add row into main legend container
        // Connect the button to the function that toggles map visibility
        UpdateVisibility(button.id, layerId, map);
    });

    const layersToFilter = [
        { id: 'Public_Secondary_Schools', type: 'Schools, Public Secondary' },
        { id: 'Catholic_Secondary_Schools', type: 'Schools, Cath. Secondary' }
    ];

    //Ward Filter for both layer
    WardFilter(map, layersToFilter);


});

