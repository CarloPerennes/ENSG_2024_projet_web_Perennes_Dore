<!DOCTYPE html>
<html lang = "fr">
<head>
    <meta charset = "UTF-8">
    <title>
        Escape Game
    </title>
    <link rel = "stylesheet" , href = "assets/accueil.css">
</head>
<body>
    <div id="main">
    <h1> The Eldorado Request</h1>
    
    <p>
    Vous êtes un explorateur à la recherche de l’Eldorado. Vous voilà sur le port de La Rochelle, prêt à embarquer pour vous lancer dans votre périple. Vous avez appris de certains collègues qu’une légende liée à l’Eldorado serait transmise à la pagode Shwedagon, en Birmanie. Certes un lieu étrange pour une légende liée à une cité en Amérique, mais apparemment elle proviendrait d'un ancien explorateur qui, après avoir cherché l'Eldorado toute sa vie, aurait vécu ses derniers jours en Birmanie, où il aurait transmis à certains proches les résultats de sa quête qu'il n'aurait jamais terminée, résultats qui devinrent avec le temps une légende. Pensant cette piste solide, vous avez décidé d’aller entendre cette légende pour en avoir le cœur net. Il ne vous reste qu’à monter à bord...
    </p>
    <div>
        <form method="POST" action="/escapegame">
            <input type="text" name="pseudo" placeholder="Nom du joueur">
            <input type="submit" value="Jouer">
        </from>
        <a href = "/halloffame">Hall of fame</a>
    </div>
    <footer>
        <p>
            Site réalisé par Carlo Pérennès et Bastien Dore
        </p>
        <p>
            Icons by <a href="icons8.com">Icons8</a>, Myanmar icons created by <a href="https://www.flaticon.com/free-icons/myanmar" title="myanmar icons">Freepik - Flaticon</a>, Musics by <a href="incompetech.com">Kevin MacLeod</a>
        </p>
    </footer>
    </div>
</body>
</html>