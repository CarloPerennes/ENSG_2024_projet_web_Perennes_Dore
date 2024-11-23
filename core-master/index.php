<?php

declare(strict_types=1);

require_once 'flight/Flight.php';
// require 'flight/autoload.php';

Flight::route('/', function () {
    //echo 'hello world!';
    Flight::render('accueil');
});

Flight::route('/accueil', function () {
    Flight::render('accueil');
});

Flight::route('/halloffame', function () {
    Flight::render('halloffame');
});

//Connexion a la base de donnees
$link = pg_connect('host=localhost dbname=projet_web user=postgres password=postgres');
pg_set_client_encoding($link, "UNICODE");
Flight::set('db', $link);

Flight::route('/test', function() {
    $link = pg_connect('host=localhost dbname=postgres user=postgres password=postgres');
    echo 'connected ? ' . $link;
});

Flight::route('/escapegame', function () {
    Flight::render('escapegame');
});

Flight::route('POST /bdd', function() {
    
    //On verifie si $_POST['query'] existe et est non vide
    if (isset($_POST['query']) and !empty($_POST['query'])) {
    
        //Requete en chaine de caracteres
        $query = $_POST['query'];
        //Nom d'une eventuelle colone qui contiendrait une geometrie
        $geom_name = $_POST['geom_name'];
        
        //Connexion a la base de donnees
        if (!Flight::get('db')) {
            die('Erreur de connexion');
        } else {
         
            //Executer la requete
            $query_result = pg_query(Flight::get('db'), $query);
            //Formater le resultat
            $tableau = [];
            $result_as_array = pg_fetch_all($query_result, PGSQL_ASSOC);
            foreach($result_as_array as $key => $ligne) {
                //Verifier si une geometrie a ete demandee
                if (!empty($geom_name)) {
                    //Formater la geometrie
                    $ligne[$geom_name] = json_decode($ligne[$geom_name]);
                }
                $tableau[] = $ligne;
            }
            //Renvoyer le resultat
            Flight::json($tableau);
        }
    }
});

Flight::route('POST /bddtest', function() {
    $query = $_POST['query'];
    //$query = "SELECT nom, ST_AsGeoJson(point) AS point FROM objet";
    //$query = "SELECT nom, depart, inventaire FROM objet";
    $geom_name = $_POST['geom_name'];
    $query_result = pg_query(Flight::get('db'), $query);
    $tableau = [];
    $result_as_array = pg_fetch_all($query_result, PGSQL_ASSOC);
    
    foreach($result_as_array as $key => $ligne){
        //$tableau[] = [$chose['nom'], json_decode($chose['point']), $chose['icone'], $chose['inventaire'], $chose['texte']];
        if (!empty($geom_name)) {
            $ligne[$geom_name] = json_decode($ligne[$geom_name]);
        }
        $tableau[] = $ligne;
    }
    //echo $query_result;
    $test = '{"test":42}';
    Flight::json($tableau);
});

Flight::route('POST /code', function () {
    Flight::json($_POST['digit1']);
});


Flight::start();
