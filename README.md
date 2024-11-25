1) Installation du jeu : - dans pgAdmin 4 avec PostgreSQL 17 recréer notre base de données avec le script SQL nommé "projet_web.sql"
Une fois la BDD crée voici les informations de connexion :

//
      $host = "localhost";
      $database = "projet_web_";
      $user = "postgres";
      $password = "postgres";
      $port = "5432";

//


- régler MAMP pour qu'il se lance dans le core master
- dans GeoServer, installé avec JAVA 17, importer notre workspace 'heat_map'  
      

- taper localhost dans un navigateur, normalement vous arrivez sur la page d'accueil du jeu.
- ensuite il suffit de rentrer son pseudo et le jeu commence



2) Jouer : Notre escape game a été conçu comme une chasse aux trésors, il faut donc bien savoir que :
      - chaque objet débloque le suivant, chaque objet correspond à une énigme / un indice qui doit permettre au joueur de comprendre où il doit se rendre ensuite. 

