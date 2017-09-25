var myForm = document.getElementById('myForm');
var myForm2 = document.getElementById('myForm2');
var input = document.getElementById('truc');

var client = new $.es.Client({
  host: "http://plf.poc.plf-sso.ppol.minint.fr/es",
});

// http://spatialreference.org/ref/epsg/rgf93-lambert-93/proj4/
// EPSG:2154
// RGF93 / Lambert-93
const lambert93 = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";

// https://github.com/kartena/Proj4Leaflet/tree/1.0.2
// crs = coordinate reference systems
var crs = new L.Proj.CRS('EPSG:2154', lambert93, {
  origin: [-35597500.0, 48953100.0],
  resolutions: [
    1322.9193125052918, 529.1677250021168, 264.5838625010584, 185.20870375074085, 119.06273812547626, 92.60435187537043, 66.1459656252646,
    39.687579375158755, 26.458386250105836, 13.229193125052918, 6.614596562526459, 2.6458386250105836, 1.3229193125052918, 0.7937515875031751,
    0.26458386250105836, 0.13229193125052918, 0.06614596562526459
  ]
});

// Coordonnées du 24BH
// lat = 48.84132995046667 / lng = 2.362522039125295
var mymap = L.map('mapid', {
  crs: crs,
  center: [48.84133, 2.36252],
  zoom: 10
});

// http://test-carte.sigpp.test-sso.ppol.minint.fr/public/rest/services/PP/FOND_PP_FINAL_512/MapServer
L.tileLayer('http://test-carte.sigpp.test-sso.ppol.minint.fr/public/rest/services/PP/FOND_PP_FINAL_512/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 16,
  minZoom: 0,
  tileSize: 512
}).addTo(mymap);

// bouton permettant de selectionner la/les couches a afficher
var overlays = {
  "couche100": cluster100,
  "couche200": cluster200,
  "couche300": cluster300,
  "couche400": cluster400,
  "couche500": cluster500,
  "couche600": cluster600,
  "couche700": cluster700,
  "couche800": cluster800,
  "Manuelle": clusterManuelle,
  "Distance": clusterDistance,
  "Positions": clusterPositions
};
var controls = L.control.layers(overlays).addTo(mymap);

// handler d'un click sur la carte
// Si la touche Ctrl est enfoncée, initialise le centre de la recherche 'geo_distance'
// Sinon crée une nouvelle feature et l'ajoute dans ES
function handleClick(e) {
  if (e.originalEvent.ctrlKey) {
    myForm2.lat.value = e.latlng.lat;
    myForm2.lng.value = e.latlng.lng;
  } else {
    var indicatif = myForm.indicatif.value;
    var vehicule = myForm.type.value;
    addFeatureInES(e.latlng, indicatif, vehicule, 'positions');
  }
}

// Ajout d'une feature dans elasticsearch
function addFeatureInES(latlng, indicatif, vehicule, type) {
  if (indicatif.length > 0 && vehicule.length > 0) {
    var d = new Date();
    client.index({
      index: 'neogeojson',
      type: type,
      body: {
        "indicatif":indicatif,
        "vehicule":vehicule,
        "date": d,
        "location": {
          "lat": latlng.lat,
          "lon": latlng.lng
        }
      }
    }, function (error, response) {
      if (error) console.error(error);
      myForm.reset();
    });
  }
}

// Permet de rechercher des features dans ES
// @params : les params de requte de la recherche
// @layer : la couche dans laquelle seront ajoutés les résultats de la recherche
// @type : le type dans lequel chercher les features
// @cluster : le cluster dans lequel ajouter les features
function search(params, layer, type, cluster) {
  var url = 'http://plf.poc.plf-sso.ppol.minint.fr/es/neogeojson/'+type+'_search';
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200 || this.status == 404) {
        var response = JSON.parse(xhr.responseText);
        toGeoJSON(response.hits.hits, layer, cluster);
      } else {
        console.error(this.status);
        console.error(xhr);
      }
    }
  };
  xhr.open("POST", url, true);
  xhr.send(JSON.stringify(params));
}

// requete geo_bounding_box
function getFeaturesInBounds() {
  coucheGeoJSON.clearLayers();
  clusterPositions.clearLayers();
  let bounds = mymap.getBounds();
  let params = {
    "size":1000,
    "query":{
      "bool": {
        "must": {
          "match_all": {}
        },
        "filter": {
          "geo_bounding_box" : {
            "location": {
              "bottom_left" : {
                "lat": bounds._southWest.lat,
                "lon": bounds._southWest.lng
              },
              "top_right" : {
                "lat": bounds._northEast.lat,
                "lon": bounds._northEast.lng,
              }
            }
          }
        }
      }
    }
  };
  search(params, coucheGeoJSON, 'positions/', clusterPositions);
  for (let couche of couches) {
    couche.layer.clearLayers();
    search(params, couche.layer, couche.name+'/', couche.cluster);
  }
}

// requete geo_distance
function getFeaturesByDistance() {
  coucheDistance.clearLayers();
  clusterDistance.clearLayers();
  let lat = myForm2.lat.value;
  let lon = myForm2.lng.value;
  let _distance = myForm2.distance.value;
  let unit = myForm2.unit.value;
  let distance = _distance+unit;
  let params = {
    "size":1000,
    "query":{
      "bool": {
        "must": {
          "match_all": {}
        },
        "filter": {
          "geo_distance": {
            "distance": distance,
            "location": {
              "lat": lat,
              "lon": lon
            }
          }
        }
      }
    }
  };
  // recherche dans toutes les couches ES
  search(params, coucheDistance, '', clusterDistance);
}

// Transforme les donnees recues d'ES au format geoJSON
function toGeoJSON(response, layer, cluster) {
  let myData =  {
    "type": "FeatureCollection",
    "features": []
  };
  for(let hit of response) {
    let lat = hit._source.location.lat;
    let lon = hit._source.location.lon;
    let feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [lon, lat]
      },
      "properties": {
        "indicatif": hit._source.indicatif,
        "vehicule": hit._source.vehicule,
        "date": hit._source.date
      }
    };
    myData.features.push(feature);
  }
  // console.log(myData);
  layer.addData(myData);
  cluster.clearLayers();
  cluster.addLayers(layer.getLayers());
}

function resetRandom() {
  coucheManuelle.clearLayers();
  clusterManuelle.clearLayers();
}

getFeaturesInBounds();

mymap.on('click', handleClick);
mymap.on('moveend', e => {
  getFeaturesInBounds();
});

// Genere un nombre aleatoires de point locaux
input.addEventListener('change', e => {
  coucheManuelle.clearLayers();
  clusterManuelle.clearLayers();
  let bounds = mymap.getBounds();
  let x1 = bounds._southWest.lng;
  let x2 = bounds._northEast.lng;
  let y1 = bounds._southWest.lat;
  let y2 = bounds._northEast.lat;
  let d = new Date();
  let myData =  {
    "type": "FeatureCollection",
    "features": []
  };
  var lon, lat, feature;
  for (let i = 0; i < e.target.value; i++) {
    lat = ((Math.random() * (y2-y1)) + y1);
    lon  = ((Math.random() * (x2-x1)) + x1);
    feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [lon, lat]
      },
      "properties": {
        "indicatif": "test",
        "vehicule": "voiture",
        "date": d
      }
    };
    myData.features.push(feature);
  }
  coucheManuelle.addData(myData);
  clusterManuelle.addLayers(coucheManuelle.getLayers());
});
