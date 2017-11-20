
<?php include 'private/header.php'; ?>
<?php echo "<h1>Hello World!</h1>" ?>
<form id="canvasForm">
  <input style="display: none;" id="canvasWidth" value="800" />
  <input style="display: none;" id="canvasHeight" value="1120" />
  Lines per page: <input id="linesPerPage" type="number" value="8" onchange="change()" /><br />
  Bars per line: <input id="barsPerLine" type="number" value="4" onchange="change()" /><br />
  Left and Right margin: <input id="paddingLeft" type="number" value="10" onchange="change()" /><br />
  Top and bottom margin: <input id="paddingTop" type="number" value="15" onchange="change()" /><br />
  Line spacing: <input id="lineSpacing" type="number" value="10" onchange="change()" /><br />
  Font size: <input id="fontSize" type="number" value="10" onchange="change()" /><br />
</form>
<canvas id='canvas' width="800" height="1120">
  <h3>Canvas is not supported :(</h3>
</canvas>
<?php include 'private/foot.php'; ?>
