<!DOCTYPE html>
<html lang = "fr">
<head>
    <meta charset = "UTF-8">
    <title>
        Escape Game
    </title>
</head>
<body>
    <h1>Hall of fame<h1>
    <a href = "/escapegame">Jouer</a>
    <a href = "/accueil">Ecran titre</a>

    <h1>TOP 10 DES MEILLEURS JOUEURS</h1>
    <table id="playertable">
    
    <table>
        <tr>
            <th>RANG</th>
            <th>PSEUDO</th> 
            <th>SCORE</th>
        </tr>

        <?php
        $rang = 1;
        foreach ($data as $row) {
            echo "<tr>";
            echo "<td>" .$rang . "</td>";
            echo "<td>" .$row['pseudo'] . "</td>";
            echo "<td>" .$row['score'] . "</td>";
            echo "</tr>";
            $rang++;
        }
        ?>
    </table>
</body>
</html>