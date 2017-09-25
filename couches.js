var styleFunction = function(feature) { return {}; };

// Permet de creer les markers des features
var pointToLayerFunction = function(geoJsonPoint, latlng) {
  var marker = L.marker(latlng);
  return marker;
};

// Permet de creer les markers des features en fonction du type de vehicule
var pointToLayerFunction2 = function(geoJsonPoint, latlng) {
  var marker;
  switch (geoJsonPoint.properties.vehicule) {
    case "bicycle":
      marker = L.marker(latlng, {icon: bicycleIcon});
    break;
    case "bike":
      marker = L.marker(latlng, {icon: bikeIcon});
    break;
    case "car":
      marker = L.marker(latlng, {icon: carIcon});
    break;
    case "policeman":
      marker = L.marker(latlng, {icon: policemanIcon});
    break;
    case "fourgon":
      marker = L.marker(latlng, {icon: fourgonIcon});
    break;
    default:
      marker = L.marker(latlng);
    break;
  }
  return marker;
};

// Permet d'ajouter un label sur toutes les features
var onEachFeatureFonction = function(feature, layer) {
  layer.bindTooltip(feature.properties.indicatif, {permanent: false, direction:'auto'});
  let truc = "";
  for (let property in layer.feature.properties) {
    truc += "<strong>"+property+" : </strong>"+layer.feature.properties[property] +"<br>";
  }
  layer.bindPopup(truc);
}

// Permet d'ajouter une popup a chaque feature, contenant ses properties
var bindPopupFunction = function(layer) {
  let truc = "";
  for (let property in layer.feature.properties) {
    truc += "<strong>"+property+" : </strong>"+layer.feature.properties[property] +"<br>";
  }
  return truc;
};

// coucheDistance : couche affichant les resultats de la recherche par distance
var coucheDistance = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction,
  onEachFeature: onEachFeatureFonction
}).bindPopup(bindPopupFunction);

// coucheGeoJSON : couche affichant des donnees au format GeoJSON
var coucheGeoJSON = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction2,
  onEachFeature: onEachFeatureFonction
}).bindPopup(bindPopupFunction);

// couche ES contenant 100 points aleatoires
var couche100 = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction
}).bindPopup(bindPopupFunction);

// couche ES contenant 200 points aleatoires
var couche200 = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction2
}).bindPopup(bindPopupFunction);

// couche ES contenant 300 points aleatoires
var couche300 = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction
}).bindPopup(bindPopupFunction);

// couche ES contenant 400 points aleatoires
var couche400 = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction
}).bindPopup(bindPopupFunction);

// couche ES contenant 500 points aleatoires
var couche500 = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction
}).bindPopup(bindPopupFunction);

// couche ES contenant 600 points aleatoires
var couche600 = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction
}).bindPopup(bindPopupFunction);

// couche ES contenant 700 points aleatoires
var couche700 = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction
}).bindPopup(bindPopupFunction);

// couche ES contenant 800 points aleatoires
var couche800 = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction
}).bindPopup(bindPopupFunction);

// couche contenant des points aleatoires generes localement
var coucheManuelle = L.geoJSON(null, {
  style: styleFunction,
  pointToLayer: pointToLayerFunction,
  onEachFeature: onEachFeatureFonction
}).bindPopup(bindPopupFunction);

var cluster100 = L.markerClusterGroup();
var cluster200 = L.markerClusterGroup();
var cluster300 = L.markerClusterGroup();
var cluster400 = L.markerClusterGroup();
var cluster500 = L.markerClusterGroup();
var cluster600 = L.markerClusterGroup();
var cluster700 = L.markerClusterGroup();
var cluster800 = L.markerClusterGroup();
var clusterPositions = L.markerClusterGroup();
var clusterManuelle = L.markerClusterGroup({chunkedLoading:true});
var clusterDistance = L.markerClusterGroup();

var couches = [
  {name: "couche100", layer: couche100, cluster: cluster100},
  {name: "couche200", layer: couche200, cluster: cluster200},
  {name: "couche300", layer: couche300, cluster: cluster300},
  {name: "couche400", layer: couche400, cluster: cluster400},
  {name: "couche500", layer: couche500, cluster: cluster500},
  {name: "couche600", layer: couche600, cluster: cluster600},
  {name: "couche700", layer: couche700, cluster: cluster700},
  {name: "couche800", layer: couche800, cluster: cluster800}
];
