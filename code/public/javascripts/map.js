
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
          
        var mymap = L.map('map').setView([30, -0.09], 2.5);
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