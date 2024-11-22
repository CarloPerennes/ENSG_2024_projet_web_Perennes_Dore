/*
var map = L.map('map').setView([42.5,-0.09], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var key_icon = L.icon({
    iconUrl: 'images/key.png',
    iconSize: [64,96],
    iconAnchor: [31,47],
    popupAnchor: [0,0]
});

var key_marker = L.marker([51.5,-0.09], {icon: key_icon});
var group_marker = new L.FeatureGroup();
group_marker.addLayer(key_marker);

map.on('zoomend', function(){
    if (map.getZoom() < 5) {
        map.removeLayer(group_marker);
    } else {
        map.addLayer(group_marker);
    }
});
*/

function createMarker(geoJsonPoint, latlng) {
    console.log(geoJsonPoint.properties.icone);
    return L.marker(latlng, {icon: L.icon({
        iconUrl: geoJsonPoint.properties.icone,
        iconSize: [64,96],
        iconAnchor: [31,47],
        popupAnchor: [0,0]
    })});
}

function clicked_object(e) {
    console.log(e.target);
    let inv = e.target.feature.properties.inventaire;
    if (inv == null) {
        console.log("pas_encore");
    } else {
        //this.liste_obj.push(e.target.feature.properties.icone);
    }
}

function onEachFeature(feature, layer) {
    if (feature.properties.texte != null) {
        layer.bindPopup(feature.properties.texte);
    }
    layer.on({
        click: clicked_object
    });
}

function display_object(object, group_marker) {
    geojson_data = {
        "type": "Feature",
        "properties": object,
        "geometry": object.point
    };
    group_marker.addLayer(L.geoJson(geojson_data, {
        pointToLayer: createMarker,
        onEachFeature: onEachFeature
    }));
}

function run_query(query, geom_name = "", group_marker) {
    console.log("debut fonction");
    let query_def = "query=" + query + "&geom_name=" + geom_name;
    fetch("/bdd", {
        method : "post",
        body : query_def,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
    })
    .then(result => result.json())
    .then(result => {
        console.log("res");
        console.log(result);
        result.forEach(element => {
            display_object(element, group_marker);
            /*
            let lon = element[1].coordinates[0];
            let lat = element[1].coordinates[1];
            let icone = element[2]
            group_marker.addLayer(L.marker([lat,lon], {icon: L.icon({
                iconUrl: icone,
                iconSize: [64,96],
                iconAnchor: [31,47],
                popupAnchor: [0,0]
            })}));
            */
        });
    })
};


var start_query = "SELECT nom,ST_AsGeoJson(point) AS point,icone,inventaire,texte FROM objet WHERE depart";
var geometry_name = "point";
/*
function start_game() {
    var start_query = "SELECT nom,ST_AsGeoJson(point) AS point,icone,inventaire,texte FROM objet WHERE depart";
    var geometry_name = "point";
    var objects = run_query(start_query, geometry_name);
    objects.forEach(element => {
        if (element.inventaire == null) {
            display_controle(element);
        } else {
            display_key(element);
        }
    })
}
run_query(start_query, geometry_name);
//start_game();
/*
objets_depart.forEach(element => {
    let lon = element[1].coordinates[0];
    let lat = element[1].coordinates[1];
    let icone = element[2]
    group_marker.addLayer(L.marker([lat,lon], {icon: L.icon({
        iconUrl: icone,
        iconSize: [64,96],
        iconAnchor: [31,47],
        popupAnchor: [0,0]
    })}));
});
*/


//group_marker.on({click: clicked_object});


Vue.createApp({
    data() {/*
        var the_map = L.map('map').setView([42.5,-0.09], 7);
        
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(the_map);
        */
        //this.test();
        //var init_result = this.init();
        return {
            the_map : null,
            group_marker : null,
            key_group : null,
            chest_group : null,
            layer_group : {},
            //liste_obj : [],
            selected_object: {nom: ""},
            liste_obj : [{nom: "cadenas", icone:"images/cadenas.png"},
                        {nom: "code", icone:"images/code.png"}],
            //polygon_set:L.featureGroup().addTo(map),
        };
    },
    methods: {
        init: function () {
            this.the_map = L.map('map').setView([42.5,-0.09], 7);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.the_map);
            
            var group_marker = new L.FeatureGroup();
            var key_group    = new L.FeatureGroup();
            var chest_group  = new L.FeatureGroup();

            this.the_map.on('zoomend', function(){
                if (this.getZoom() < 5) {
                    this.removeLayer(group_marker);
                } else {
                    this.addLayer(group_marker);
                }
            });
            this.the_map.on('zoomend', function(){
                if (this.getZoom() < 5) {
                    this.removeLayer(key_group);
                } else {
                    this.addLayer(key_group);
                }
            });
            this.the_map.on('zoomend', function(){
                if (this.getZoom() < 5) {
                    this.removeLayer(chest_group);
                } else {
                    this.addLayer(chest_group);
                }
            });

            this.group_marker = group_marker;
            this.key_group    = key_group;
            this.chest_group  = chest_group;
            
            let start_query = "SELECT nom,ST_AsGeoJson(point) AS point,icone,inventaire,texte,parent,enfant FROM objet WHERE depart";
            let geometry_name = "point";
            
            this.installation(start_query, geometry_name);

            /*
            return {
                the_map: the_map,
                group_marker: group_marker,
            }*/
        },
        test: function (string) {
            console.log(string);
        },

        setSelection: function (object) {
            console.log("setSelection");
            console.log(object);
            this.selected_object = object;
        },

        createMarker: function (geoJsonPoint, latlng) {
            console.log(geoJsonPoint.properties.icone);
            return L.marker(latlng, {icon: L.icon({
                iconUrl: geoJsonPoint.properties.icone,
                iconSize: [64,96],
                iconAnchor: [31,47],
                popupAnchor: [0,0]
            })});
        },
        
        clicked_object: function (e) {
            console.log(e.target);
            var obj = e.target.feature.properties
            let inv = obj.inventaire;
            if (inv == null) {
                console.log("pas_encore");
                //console.log(obj.parent != null && obj.parent == this.selected_object.nom);
                if (obj.parent != null && obj.parent == this.selected_object.nom) {
                    //console.log("passe");
                    this.debloque(obj);
                }
            } else {
                this.liste_obj.push(obj);
                this.key_group.removeLayer(this.layer_group[obj.nom]);
            }
        },
        
        onEachFeature: function (feature, layer) {
            if (feature.properties.texte != null) {
                layer.bindPopup(feature.properties.texte);
            }
            layer.on({
                click: this.clicked_object
            });
        },
        
        display_object: function (object) {
            geojson_data = {
                "type": "Feature",
                "properties": object,
                "geometry": object.point
            };
            var layer = L.geoJson(geojson_data, {
                pointToLayer: this.createMarker,
                onEachFeature: this.onEachFeature
            });
            this.layer_group[object.nom] = layer;

            if (object.inventaire == null) {
                this.chest_group.addLayer(layer);
            } else {
                this.key_group.addLayer(layer);
            }
        },

        installation: function (query, geom_name = "") {
            //Fetch request
            console.log("debut fonction");
            let query_def = "query=" + query + "&geom_name=" + geom_name;
            fetch("/bdd", {
                method : "post",
                body : query_def,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
            })
            .then(result => result.json())
            .then(result => {
                //Function
                console.log("res");
                console.log(result);
                result.forEach(element => {
                    this.display_object(element);
                });
            })
        },

        debloque: function (object) {
            //Fetch request
            console.log("debut fonction");
            //Query def
            let noms_enfant = object.enfant.split(',');
            let def_array = "ARRAY[";
            noms_enfant.forEach(nom => {
                def_array = def_array + "'" + nom + "'" + ","
            });
            def_array = def_array.substring(0,def_array.length - 1) + "]";
            let query = "SELECT nom,ST_AsGeoJson(point) AS point,icone,inventaire,texte,parent,enfant FROM objet WHERE nom = ANY (" + def_array + ")";
            console.log(query);
            let geom_name = "point"
            let query_def = "query=" + query + "&geom_name=" + geom_name;
            fetch("/bdd", {
                method : "post",
                body : query_def,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                    }
            })
            .then(result => result.json())
            .then(result => {
                //Function
                console.log("res");
                console.log(result);
                result.forEach(element => {
                    this.display_object(element);
                });
            })
        },

        // Previous functions
        load_city () {
            this.liste_autocompletion = [];
            //console.log(this.nom_ville);
            fetch('http://api-adresse.data.gouv.fr/search/?q=' + this.nom_ville)
            .then(result => result.json())
            .then(result => {
                let lat = result.features[0].geometry.coordinates[1];
                let lon = result.features[0].geometry.coordinates[0];
                this.marker_set.clearLayers();
                var marker = L.marker([lat, lon]).addTo(this.marker_set);
                map.flyTo(new L.LatLng(lat,lon));
            });
        },

        autoCompletion () {
            let donnees = 'recherche=' + formatage(this.nom_ville);
            fetch("/villes", {
                method : "post",
                body : donnees,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
            })
            .then(result => result.json())
            .then(result => {
                this.liste_autocompletion = [];
                result.forEach(commune => {
                    this.liste_autocompletion.push({nom:commune.nom, insee:commune.insee});
                });
            });
        },

        chooseCity (insee) {
            donnees = "insee_ville=" + insee;
            fetch("/villes", {
                method : "post",
                body : donnees,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
            })
            .then(result => result.json())
            .then(result => {
                console.log("res");
                console.log(result);
            })
            this.liste_autocompletion = [];
            this.load_city();
        }
    },
    mounted() {
        this.init();
    },
}).mount('#inventaire');


function formatage (chaine) {
    return chaine.replace("'","\\'");
};