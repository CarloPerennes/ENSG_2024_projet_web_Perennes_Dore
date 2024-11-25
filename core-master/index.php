<?php

declare(strict_types=1);

require_once 'flight/Flight.php';
// require 'flight/autoload.php';

Flight::route('/', function () {
    //echo 'hello world!';
    Flight::render('accueil');
});

//Connexion a la base de donnees
$link = pg_connect('host=localhost dbname=projet_web user=postgres password=postgres');
pg_set_client_encoding($link, "UNICODE");
Flight::set('db', $link);

Flight::route('/test', function() {
    $link = pg_connect('host=localhost dbname=postgres user=postgres password=postgres');
    echo 'connected ? ' . $link;
});

Flight::route('/accueil', function () {
    Flight::render('accueil');
});

Flight::route('GET /escapegame', function () {
    Flight::render('escapegame');
});

Flight::route('POST /escapegame', function () {
    if (isset($_POST['pseudo']) and !empty($_POST['pseudo'])) {
        $pseudo = $_POST['pseudo'];
    } else {
        $pseudo = "User";
    }
    Flight::render('escapegame', ['pseudo' => $pseudo]);
});

Flight::route('/halloffame', function() {
    $query = "SELECT pseudo, score FROM score ORDER BY score DESC, pseudo ASC LIMIT 10";


    $query_result = pg_query(Flight::get('db'), $query);
    $result_as_array = pg_fetch_all($query_result, PGSQL_ASSOC);

    $data = array();
    foreach($result_as_array as $key => $row) {
        array_push($data, $row);
    }

    Flight::render('halloffame', ['data' => $data]);
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

Flight::route('POST /getTime', function() /*use ($con)*/ {
    $temps  = Flight::request()->data['temps'];
    $pseudo = Flight::request()->data['pseudo'];
    $score  = Flight::request()->data['score'];


   
    $query = "INSERT INTO score(pseudo,score) VALUES ($1,$2)"; // Ajout de la mise à jour de score

    $result = pg_query_params(Flight::get('db'), $query, array($pseudo,$score));
    if ($result) {
        echo "Mise à jour réussie";
        echo $temps . ' ' . $pseudo . ' ' . $score;
       
    } else {
        echo "Problème lors de la mise à jour : " . pg_last_error(Flight::get('db'));
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
