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

*/


Vue.createApp({
    data() {
        return {
            the_map : null,
            group_marker : null,
            key_group : null,
            chest_group : null,
            layer_group : {},
            popup_text: "",
            cadenas: null,
            digit1: 7,
            digit2: 5,
            digit3: 3,
            digit4: 4,
            //liste_obj : [],
            selected_object: {nom: ""},
            liste_obj : [{nom: "cadenas", icone:"images/cadenas.png"},
                        {nom: "code", icone:"images/code.png"}],
        };
    },
    methods: {
        init: function () {
            const the_map = L.map('map', {zoomAnimation: false}).setView([42.5,-0.09], 7);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(the_map);
            
            var marker_cadenas = new L.FeatureGroup();
            /*
            group_marker.addTo(the_map);
            key_group.addTo(the_map);
            chest_group.addTo(the_map);
            marker_cadenas.addTo(the_map);
            */
            /*
            the_map.on('zoomend', function(){
                if (this.getZoom() < 5) {
                    this.removeLayer(group_marker);
                } else {
                    this.addLayer(group_marker);
                }
            });
            the_map.on('zoomend', function(){
                if (this.getZoom() < 5) {
                    this.removeLayer(key_group);
                } else {
                    this.addLayer(key_group);
                }
            });
            the_map.on('zoomend', function(){
                if (this.getZoom() < 5) {
                    this.removeLayer(chest_group);
                } else {
                    this.addLayer(chest_group);
                }
            });
            */
            marker_cadenas.on('click', (e) => {
                let marker = e.layer;
                this.popup_text = marker.objet_texte;
                marker.setPopupContent(this.$refs.popup);
            });

            this.the_map = the_map;

            this.marker_cadenas = marker_cadenas;
            
            let start_query = "SELECT nom,ST_AsGeoJson(point) AS point,type,icone,inventaire,texte,parent,enfant,zoom FROM objet WHERE depart";
            let geometry_name = "point";
            
            this.installation(start_query, geometry_name);
        },
        test: function () {
            console.log("string");
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
            var layer_group = new L.FeatureGroup();
            layer_group.addLayer(layer);

            if (this.the_map.getZoom() >= object.zoom) {
                layer_group.addTo(this.the_map);
            }
            
            this.the_map.on('zoomend', function(){
                if (this.getZoom() < object.zoom) {
                    this.removeLayer(layer_group);
                } else {
                    this.addLayer(layer_group);
                }
            });

            this.layer_group[object.nom] = layer_group;
            /*
            if (object.type != "cle") {
                this.chest_group.addLayer(layer_group);
            } else {
                this.key_group.addLayer(layer_group);
            }
            */
        },

        createMarker: function (geoJsonPoint, latlng) {
            let object = geoJsonPoint.properties;
            //console.log(object.icone);
            let marker = L.marker(latlng, {icon: L.icon({
                iconUrl: object.icone,
                iconSize: [64,96],
                iconAnchor: [31,47],
                popupAnchor: [0,0]
            })});
            if (object.type == "cadenas") {
                marker.objet_nom = object.nom;
                marker.objet_texte = object.texte;
                marker.bindPopup();
                marker.addTo(this.marker_cadenas);
            }
            return marker;
        },
        
        onEachFeature: function (feature, layer) {
            if (feature.properties.type == "cadenas") {
                console.log("add_cadenas");
                //layer.bindPopup(this.popupContent)
            } else {
            if (feature.properties.type != "cle") {
                layer.bindPopup(feature.properties.texte);
            }
            }
            layer.on({
                click: this.clicked_object
            });
        },
        
        clicked_object: function (e) {
            console.log(e.target);
            var obj = e.target.feature.properties
            switch (obj.type) {
                case "coffre":
                    //console.log("pas_encore");
                    //console.log(obj.parent != null && obj.parent == this.selected_object.nom);
                    if (obj.parent == this.selected_object.nom) {
                        //console.log("passe");
                        this.debloque(obj);
                    }
                    break;
                case "cle":
                    this.liste_obj.push(obj);
                    this.layer_group[obj.nom].clearLayers();
                    //this.the_map.removeLayer(this.layer_group[obj.nom]);
                    break;
                case "cadenas":
                    this.cadenas = obj;
                    break;
                default:
                    console.log("default");
            }
        },

        setSelection: function (object) {
            console.log("setSelection");
            console.log(object);
            this.selected_object = object;
        },

        submit_function: function () {
            console.log("submited");
            let code_try = this.digit1.toString() + this.digit2.toString() + this.digit3.toString() + this.digit4.toString();
            console.log(this.cadenas.parent == code_try);
            if (this.cadenas.parent == code_try) {
                this.debloque(this.cadenas);
            }
        },

        popupContent: function (target) {
            //This is an old function. It is no more used.
            let texte = target.feature.properties.texte;
            let html = '<p>' + texte + '</p>' +
                        '<form @submit.prevent="submit_function">' +
                            '<input type="number" id="digit1" name="digit1" min="0" max="9">' +
                            '<input type="number" id="digit2" name="digit2" min="0" max="9">' +
                            '<input type="number" id="digit3" name="digit3" min="0" max="9">' +
                            '<input type="number" id="digit4" name="digit4" min="0" max="9">' +
                            '<input type="submit" name="envoi" value="OK">' +
                        '</form>';
            return html;

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
            if (object.enfant == "victory") {
                this.finish();
            } else {
            console.log("debut debloque");
            //Query def
            let noms_enfant = object.enfant.split(',');
            let def_array = "ARRAY[";
            noms_enfant.forEach(nom => {
                def_array = def_array + "'" + nom + "'" + ",";
            });
            def_array = def_array.substring(0,def_array.length - 1) + "]";
            let query = "SELECT nom,ST_AsGeoJson(point) AS point,type,icone,inventaire,texte,parent,enfant,zoom FROM objet WHERE nom = ANY (" + def_array + ")";
            console.log(query);
            let geom_name = "point"
            this.installation(query, geom_name);
            this.layer_group[object.nom].setPopupContent(object.nom);
        }
        },

        finish: function () {
            alert("Félicitation !\nVous avez gagné !!!")
        },

    },
    mounted() {
        this.init();
    },
}).mount('#inventaire');


function formatage (chaine) {
    return chaine.replace("'","\\'");
};