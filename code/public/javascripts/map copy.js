
      var stringHome = "Home";
      var stringTeam = "Teams";
      var stringEvents = "Events";
      var stringMap = "Map";
      
      arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];
      
      window.onload=function(){
          createNav();
          createMap();
      }

      function createNav(){
          let aux="";
          for(let i=0; i<arrayOfItems.length; i++){
              aux+="<span class='navContainer' onclick='show("+i+")'>"+arrayOfItems[i]+"</span>";
          }
          document.getElementById("navItems").innerHTML = aux;
      }
      
      function show(index){
          switch(index){
              case 0:
                  window.location = "../index.html";
                  break;
              case 1:
                  window.location = "team.html";
                  break;
              case 2:
                  window.location = "event.html";
                  break;
              case 3:
                  window.location = "map.html";
                  break;
          }
      }

      function createMap(){
        var center = [30, -0.09];//depois podemos por a localização do user
        var mymap = L.map('map').setView(center, 2.5);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        //id: 'mapbox/satellite-v9',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoid293Z2FtZXIyIiwiYSI6ImNraW16d2RuNjB5bjMycnBraHBuaWtubDUifQ.y1Y5Bqwqfg-FoIWJU0bG5g'
        }).addTo(mymap);
  
        var searchControl = L.esri.Geocoding.geosearch().addTo(mymap);
  
        var results = L.layerGroup().addTo(mymap);
  
        searchControl.on('results', function (data) {
        results.clearLayers();
        //make a marker in location
        // for (var i = data.results.length - 1; i >= 0; i--) {
        // results.addLayer(L.marker(data.results[i].latlng));
        // }
        });
  
        //marker
        var simpleIcon = L.icon({
      iconUrl: 'images/simplemarker.png',
  
      iconSize:     [38, 95], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
        //markers
        L.marker([51.5, -0.09], {icon: simpleIcon}).addTo(map);
        }

        
// Initialise the FeatureGroup to store editable layers
var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

var options = {
  position: 'topleft',
  draw: {
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: '#e1e100', // Color the shape will turn when intersects
        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
      },
      shapeOptions: {
        color: '#97009c'
      }
    },
    polyline: {
    	shapeOptions: {
        color: '#f357a1',
        weight: 10
          }
    },
    // disable toolbar item by setting it to false
    polyline: true,
    circle: true, // Turns off this drawing tool
    polygon: true,
    marker: true,
    rectangle: true,
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: true
  }
};

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw(options);
map.addControl(drawControl);

var editableLayers = new L.FeatureGroup();
map.addLayer(editableLayers);

map.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;

  if (type === 'polyline') {
    layer.bindPopup('A polyline!');
  } else if ( type === 'polygon') {
  	layer.bindPopup('A polygon!');
  } else if (type === 'marker') 
  {layer.bindPopup('marker!');}
  else if (type === 'circle') 
  {layer.bindPopup('A circle!');}
   else if (type === 'rectangle') 
  {layer.bindPopup('A rectangle!');}


  editableLayers.addLayer(layer);
});