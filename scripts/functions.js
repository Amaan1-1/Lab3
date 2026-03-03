function addLayer(map, layerId, SchoolType, circleColor){
    map.addLayer({
        id: layerId,
        type: 'circle',
        source: 'City_Landmarks', // data from: https://data.mississauga.ca/datasets/city-landmarks/explore?location=43.608784%2C-79.674887%2C10
        paint: {
            'circle-radius': 
                 [ // Circle radius changes smoothly with zoom levels
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    8, 1,
                    10, 3,
                    12, 10,
                    14, 18,
                    16, 30
                ],
            'circle-color': circleColor,
            //Choosing different colors for circle from function parameters to differentiate between school types
            'circle-stroke-width': 1.5,
            'circle-emissive-strength': 1.1,
            'circle-stroke-color': '#ffffff' 
            //stroking the circle white for better visibility
        },
        'filter': ['==', ['get', 'TYPEDESC'], SchoolType]
        //filtering by using the TYPEDESC property from geojson 
    });
}


function addPopup(map, layerId){
    // Open popup when user clicks on a school point
    map.on('click', layerId, (e) => {
        const properties = e.features[0].properties;
        const addr = properties.STNO + " " + properties.STNAME + " " + 
        properties.SUFFIX + " " + properties.POSTDIR;

        //Show school name and address in pop up
        // A helper function called cleanSchoolName is used to remove 
        // redundant information from names
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("<b>Name:</b> " + cleanSchoolName(properties.LANDMARKNAME) + "<br>" +
                     "<b>Address</b>: " + addr.trim())
            .addTo(map);
    });

    // Change cursor style when hovering over a clickable feature
    map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Reset cursor when leaving the feature
    map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
    });

    // Add a hover effect by increasing stroke of all points within
    // that layer when mouse is over a point
    map.on('mousemove', layerId, () => {
        map.setPaintProperty(layerId, 'circle-stroke-width', 3);
    });

    map.on('mouseleave', layerId, () => {
        map.setPaintProperty(layerId, 'circle-stroke-width', 1.5);
    });
        
}


/*
All school names have (9-12) for grade ranges and (Cs) for catholic schools,
however we are only showing secondary schools and we have a legend so this 
information is redundant and can be removed
*/
function cleanSchoolName(name) {

    let cleanName = "";
    //loop through the name until we run into a bracket then stop adding
    //characters to the cleaned name
    for(let i = 0; i < name.length; i++){
        if(name[i] === "("){
            break
        }
        cleanName += name[i];
    }

    return cleanName;
}

//Goes back to original map view when reset button is clicked
function resetButton(map, button){
    document.getElementById(button).addEventListener('click', () => {
        map.flyTo({
            center: [-79.65, 43.61], 
            zoom: 10.4, 
            bearing: -45, // Tilted map angle
            essential: true 
        });
    });

}

function UpdateVisibility(buttonId, label, map){
    document.getElementById(buttonId).addEventListener('click', () => {
        //Checking if the points are visible by using 
        // the function getLayoutProperty() from: https://docs.mapbox.com/mapbox-gl-js/api/map/#map#getlayoutproperty
        const visibility = map.getLayoutProperty(label, 'visibility');
        //If the points are visible then hide them and change the text on the button 
        // to say "Show"
        if(visibility !== "none"){
            map.setLayoutProperty(label, 'visibility', 'none');
            document.getElementById(buttonId).innerHTML = "Show";
        }
        else{
            //if the points are not visible then display them and change
            // text on the button to say "hide"
            document.getElementById(buttonId).innerHTML = "Hide";
            map.setLayoutProperty(label, 'visibility', 'visible');
        }
    });
}

//Source https://docs.mapbox.com/mapbox-gl-js/example/mouse-position/
//Show long and lat of mouse 
function LatLngDisplay(map) {
    map.on('mousemove', (e) => {
        let coords = e.lngLat.wrap();  
        const lng = coords.lng.toString().slice(0, 6);  
        const lat = coords.lat.toString().slice(0, 5);    
        //source for string slicing: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice

        document.getElementById('coordinate-display').innerHTML = "Longitude: " + lng + " | Latitude: " + lat;
    });
}


function WardFilter(map, layers) {
     // add change event listener to ward dropdown
    document.getElementById('ward-select').addEventListener('change', (e) => {

        for(let i = 0; i < layers.length; i++){
             // show all schools of this type if "all" selected
            if(e.target.value === "all"){
                map.setFilter(layers[i].id, ['==', ['get', 'TYPEDESC'], layers[i].type]);
            }
            else{
                // filtering by specific ward if selected
                map.setFilter(layers[i].id, [
                    'all',
                    ['==', ['get', 'TYPEDESC'], layers[i].type],
                    ['==', ['get', 'WARD'], e.target.value]
                ]);
            }
        }
    });
}