<?php if($head){ ?>
    <li class="nav-item">
        <a class="nav-link" data-toggle="tab" id="formAccentHeader" href="#formAccent">Accents</a>
    </li>
<?php } else { ?>
    <div id="formAccent" class="tab-pane fade">
        <div class="form-row">
            <label for="rudimentSelect">Rudiment:</label>
            <select id="rudimentSelect" class="form-control">
                <option value="paradidle">Paradidles</option>
                <option value="double">Doubles</option>
                <option value="doubleParadidle">Double Paradidles</option>
                <option value="custom">Custom</option>
            </select>
            <input class="form-control btn btn-secondary" id="generateAccents" type="button" value="Generate" onclick="generateAccentsClick()">
        </div>
    </div>
<?php } ?>
