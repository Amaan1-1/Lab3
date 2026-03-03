## Overview

The objective of this lab is to demonstrate **data‑driven styling**, **event‑based interactivity**, and **user interface integration** using **JavaScript** and **Mapbox GL JS**.

The resulting web map displays **Public and Catholic Secondary Schools** in the **City of Mississauga**, Ontario. Each school is represented by an interactive point symbol that users can click to learn more about the school’s name and address.

---

## Map Description

- **Dataset:**  
  [City of Mississauga – City Landmarks GeoJSON](https://data.mississauga.ca/datasets/city-landmarks/explore)  
  This dataset includes locations of landmarks across Mississauga, filtered to show only Public and Catholic Secondary Schools.

---

## Key Features

### 1. Data‑Driven Styling Data
Symbols are styled dynamically using a zoom‑based **interpolation expression**:

- Circle radius increases smoothly with higher zoom levels.  
- Each school type uses a unique color 
- Circles have a white stroke for better visibility against the basemap.

### 2. Filtering by Attribute
Only features with `TYPEDESC` values matching:
- `Schools, Public Secondary`, or  
- `Schools, Cath. Secondary`  
are displayed.  

### 3. Pop‑Up Interactivity
Clicking on a school opens a popup showing:
- School name (cleaned of redundant text like “(9–12)” or “(Cs)”)  
- Formatted street address  
The popup appears at the school’s location.

### 4. Visibility Toggle Buttons
Each legend entry contains a **Hide/Show** button that toggles layer visibility in real‑time using `setLayoutProperty()`

### 5. Reset Map View Button
A “Reset Map View” button smoothly returns the map to its original centre, zoom, and bearing using the `flyTo()` method.

### 6. Legend
The legend is generated directly from JavaScript arrays and styled through CSS variables.  
It includes:
- Color circles that match school symbology  
- Associated labels and visibility buttons for both layers

### 7. Easy to follow UI & Readability in code
- Cursor changes when hovering over clickable points.  
- Clear section headers and consistent commenting throughout the code for readability.  
- Clean page layout with a descriptive title and brief introduction.

---

## Map Controls

- **Search (Geocoder):** Allows searching for locations within Canada.  
- **Navigation Control:** Enables zooming and rotation.  
- **Fullscreen Control:** Expands the map .

---

## Files

├── index.html # Main webpage file
├── style.css # Styling for layout, legend, and buttons
├── script.js # Initializes map, adds sources and layers
├── functions.js # Helper functions for interactivity (popups, visibility, reset)
├── data/
│ └── City_Landmarks.geojson
└── README.md # Project documentation


