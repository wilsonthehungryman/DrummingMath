<?php if($head){ ?>
    <li class="nav-item">
        <a class="nav-link" data-toggle="tab" id="formAccentHeader" href="#formAccent">Accents</a>
    </li>
<?php } else { ?>
    <div id="formAccent" class="tab-pane fade">
        <div class="form-row">
            <div class="form-group">
                <label for="rudimentSelect">Rudiment:</label>
                <select id="rudimentSelect" class="form-control" onchange="rudimentSelected()">
                    <option value="paradidle">Paradidles</option>
                    <option value="double">Doubles</option>
                    <option value="doubleParadidle">Double Paradidles</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            <div class="form-group" id="customStickingGroup">
                <label for="customSticking">Custom Sticking:</label>
                <input class="form-control" id="custom" type="text" onchange="customStickingChange()" onkeyup="customStickingChange()" onpaste="customStickingChange()" placeholder="RLRR" />
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6">
                <label class="form-checklabel">
                    <input class="form-check-input" id="leftLead" type="checkbox" onchange="rudimentSelected()" value="" />
                    Left lead
                </label>
            </div>
            <div class="form-group col-md-6">
                <label class="form-checklabel">
                    <input class="form-check-input" id="andReverse" type="checkbox" onchange="rudimentSelected()" value="" />
                    Append the reverse
                </label>
            </div>
            <div class="form-group" >
                <label for="stickingPreview">Preview:</label>
                <input type="text" readonly class="form-control-plaintext" id="stickingPreview" value="" />
            </div>
            <input class="form-control btn btn-secondary" id="generateAccents" type="button" value="Generate" onclick="generateAccentsClick()">
        </div>
    </div>
<?php } ?>
