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
            digit1: null,
            digit2: null,
            digit3: null,
            digit4: null,
            liste_obj : [],
            selected_object: {nom: ""},
            audiopiste: null,

            start: Date.now(),

            boutonTriche: null,

            pseudo: null,
            /*
            liste_obj : [{nom: "cadenas", icone:"images/cadenas.png"},
                        {nom: "code", icone:"images/code.png"}],*/
        };
    },
    methods: {
        init: function () {
            const the_map = L.map('map', {zoomAnimation: false}).setView([46.15252, -1.16541], 15);

            the_map.flyTo([16.8,96.1496], 17);

            this.osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

            this.marker_cadenas = marker_cadenas;

            // Ajout de la carte de chaleur pour la triche, seulement si le joueur clique sur le bouton triche
            var triche = L.tileLayer.wms("http://localhost:8081/geoserver/wms", { 
            // /!\ pour nous le port est 8081, surement nécessaire de remettre 8080  layers et format seront a change 
            layers: 'heat_map:objet',
            styles: 'style_heat_map',
            format: 'image/PNG',
            transparent: true
            });//.addTo(map);

            var boutonTriche = document.getElementById('btnTriche');

            boutonTriche.addEventListener('click', function() {
                this.scoreTriche = true;
    
                if (!the_map.hasLayer(triche)) {
                    console.log("triche");
                    // affichage de la carte de triche
                    triche.addTo(the_map);
                    //boutonTriche.textContent = "Désactiver la triche"; 
                } else {
                    console.log("detriche");
                    // désaffichage de la carte de triche
                    the_map.removeLayer(triche);
                    //boutonTriche.textContent = "Activer la triche"; 
                }
            });
            // variable pour savoir si le joeur a triché et compter son score en fonction
            boutonTriche.scoreTriche = false;
            this.boutonTriche = boutonTriche;

            this.the_map = the_map;
            
            
            let start_query = "SELECT nom,ST_AsGeoJson(point) AS point,type,icone,inventaire,texte,parent,enfant,zoom,height,width,audio FROM objet WHERE depart";
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

            if (object.audio != null) {
                this.audiopiste = object.audio;
            }
        },

        createMarker: function (geoJsonPoint, latlng) {
            let object = geoJsonPoint.properties;
            //console.log(object.icone);
            let marker = L.marker(latlng, {icon: L.icon({
                iconUrl: object.icone,
                iconSize: [object.width,object.height],
                iconAnchor: [Math.floor(object.width/2),Math.floor(object.height/2)],
                popupAnchor: [0,-Math.floor(object.height/2)]
            })});
            if (object.type == "cadenas") {
                marker.objet_nom = object.nom;
                marker.objet_texte = object.texte;
                marker.bindPopup("",{'maxWidth': 1000, 'width':900});
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
                layer.bindPopup(feature.properties.texte, {'maxWidth': 750});
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

            if (obj.nom == "perso") {
                this.the_map.setView([-16.4395,-68.1487], 15);
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
                this.digit1 = null;
                this.digit2 = null;
                this.digit3 = null;
                this.digit4 = null;
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
            this.layer_group[object.nom].clearLayers();
            console.log("debut debloque");
            console.log(this.boutonTriche.scoreTriche);
            //Query def
            let noms_enfant = object.enfant.split(',');
            let def_array = "ARRAY[";
            noms_enfant.forEach(nom => {
                def_array = def_array + "'" + nom + "'" + ",";
            });
            def_array = def_array.substring(0,def_array.length - 1) + "]";
            let query = "SELECT nom,ST_AsGeoJson(point) AS point,type,icone,inventaire,texte,parent,enfant,zoom,height,width,audio FROM objet WHERE nom = ANY (" + def_array + ")";
            console.log(query);
            let geom_name = "point"
            this.installation(query, geom_name);
            this.layer_group[object.nom].setPopupContent(object.nom);
        }
        },

        // Fonction pour calculer le score, en fonction du temps et de l'activation ou non de la triche
        score: function (timeString, scoreTriche) {
            // gestion si erreur
            if (typeof timeString !== 'string' || !timeString.includes(':')) {
                console.error('timeString invalide ou manquant:', timeString);
                return 0; 
            }

            // conversion du temps en string en entier (nombre de secondes)
            var parts = timeString.split(':');
            var hours = parseInt(parts[0], 10);
            var minutes = parseInt(parts[1], 10);
            var seconds = parseInt(parts[2], 10);

            var totalSeconds = hours * 3600 + minutes * 60 + seconds;

            // calcul du score
            var score = 10000 - totalSeconds;

            if (scoreTriche === false){
                score = score *2;
            } // score bonifié si le joeur ne triche pas

            return score;
        },

        // Fonction pour afficher un timer et pour stocker le temps écoulé (dans timePast)
        getTimePast: function () {
                
            var now = Date.now();
            var diff = now - this.start;
            var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            var mins = Math.floor((diff / (1000 * 60)) % 60);
            var sec = Math.floor((diff / 1000) % 60);

            var timePast = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
            return timePast;
        },

        envoyerTemps: function(timePast, result) {
            console.log("envoie le temps")
            try {
                var pseudo = this.$refs.pseudo.outerText;
            } catch {
                var pseudo =  "User";
            }

            fetch('/getTime', {  
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: "temps=" +encodeURIComponent(timePast)+ '&score=' + encodeURIComponent(result)+ '&pseudo=' + encodeURIComponent(pseudo),
            })
            .then(response => response.text())
            .then(data => {
                console.log('Réponse du serveur PHP : ' + data);
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi des données : ", error);
            });
        },

        finish: function () {
            let timeString = this.getTimePast();
            let scoreTriche = this.boutonTriche.scoreTriche;
            console.log("timestr");
            console.log(timeString);
            console.log("score_triche");
            console.log(scoreTriche);

            let score = this.score(timeString,scoreTriche);
            console.log("score");
            console.log(score);

            this.envoyerTemps(timeString, score);
            alert("Félicitation !\nVous avez gagné !!!\nVous avez "+score.toString() + " points");
        },

    },
    mounted() {
        this.init();
    },
}).mount('#app');


function formatage (chaine) {
    return chaine.replace("'","\\'");
};