var TypeIcon = L.Icon.extend({
  options: {
    iconSize:     [24, 24],
    iconAnchor:   [12, 12],
    popupAnchor:  [0, -12]
  }
});

var bicycleIcon = new TypeIcon({iconUrl:'images/bicycleB.png'});

var bikeIcon = new TypeIcon({iconUrl:'images/bikeB.png'});

var carIcon = new TypeIcon({iconUrl:'images/carB.png'});

var policemanIcon = new TypeIcon({iconUrl:'images/policemanB.png'});

var fourgonIcon = new TypeIcon({iconUrl:'images/fourgonB.png'});

// var icons {
//   "blue" : {
//     "bicycle": bicycleIconB,
//     "bike": bikeIconB,
//     "car": carIconB,
//     "policeman": policemanIconB,
//     "fourgon": fourgonIconB
//   },
//   "red" : {
//     "bicycle": bicycleIconR,
//     "bike": bikeIconR,
//     "car": carIconR,
//     "policeman": policemanIconR,
//     "fourgon": fourgonIconR
//   },
// }
