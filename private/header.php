<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $page; ?> | Drumming Math</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" type="text/css" href="../css/site.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script>
        <script type="application/javascript" src="../js/site.js"></script>
      </head>
<body>
<?php include 'menu.php' ?>
<?php if($_GET["d"]) { ?>
<div class="container" id="disclaimer">
    <div class="row">
        <div class="col align-self-center">
            <h3>Disclaimer:</h3>
            <button type="button" class="btn btn-success" onclick="hideDisclaimer()">(hide)</button>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <p>This site is new and still under construction. Expect things to be more or less broken for the time being.
            </br>If you have a request or want to contribute, check out the <a href="https://github.com/wilsonthehungryman/DrummingMath">repository</a></p>
            <p>Checkout the <a href="../blank_manuscript.php">Blank Manuscript page</a>, it is mostly functional.</p>
            <p><a href="../accents.php">Accents</a> is well on its way.</p>
        </div>
    </div>
</div>
<?php } ?>
