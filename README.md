# The Eldorado Request
Manuel d'installation du jeu:

## 1) Présentation du contenu :
core-master : dossier contenant le jeu (php, js, css, heatmap, images, audio)

projet_web.sql : fichier d'intallation de la base de donnée

solution.pdf : un manuel qui explique comment résoudre le jeu

## 2) Installation du jeu :
- dans pgAdmin 4 avec PostgreSQL 17 recréer notre base de données avec le script SQL nommé "projet_web.sql"
Une fois la BDD crée voici les informations de connexion :

//
      $host = "localhost";
      $database = "projet_web";
      $user = "postgres";
      $password = "postgres";
      $port = "5432";

//


- régler MAMP pour qu'il se lance dans le core master avec la version de php 7.4.16
- dans GeoServer, installé avec JAVA 17, importer notre workspace 'projet' qui se trouve dans le dossier 'core-master'.
      

- taper localhost dans un navigateur, normalement vous arrivez sur la page d'accueil du jeu.
- ensuite il suffit de rentrer son pseudo et le jeu commence



## 3) Jouer :
Notre escape game a été conçu comme une chasse aux trésors, il faut donc bien savoir que :

      - chaque objet débloque le suivant, chaque objet correspond à une énigme / un indice qui doit permettre au joueur de comprendre où il doit se rendre ensuite. 

## 4) Synopsis :
Vous êtes un explorateur à la recherche de l’Eldorado. Vous voilà sur le port de La Rochelle, prêt à embarquer pour vous lancer dans votre périple. Vous avez appris de certains collègues qu’une légende liée à l’Eldorado serait transmise à la pagode Shwedagon, en Birmanie. Certes un lieu étrange pour une légende liée à une cité en Amérique, mais apparemment elle proviendrait d'un ancien explorateur qui, après avoir cherché l'Eldorado toute sa vie, aurait vécu ses derniers jours en Birmanie, où il aurait transmis à certains proches les résultats de sa quête qu'il n'aurait jamais terminée, résultats qui devinrent avec le temps une légende. Pensant cette piste solide, vous avez décidé d’aller entendre cette légende pour en avoir le cœur net. Il ne vous reste qu’à monter à bord...
