<div class="container mb-3">
    <div class="row">
        <!-- <div class="card-header"> -->
            <ul class="nav nav-tabs col-md-8 mx-auto">
                <?php if ($form) {
                    $head = true;
                    include($form);
                } ?>
                <li class="nav-item">
                    <a class="nav-link" data-toggle="tab" id="formPageHeader" href="#formPage">Page</a>
                </li>
            </ul>
        </div>
    <div class="row">
        <form id="canvasForm" class="col-md-8 mx-auto">
            <div class="tab-content">
                    <div id="formPage" class="tab-pane fade">
                      <input style="display: none;" type="hidden" id="canvasWidth" value="800" />
                      <input style="display: none;" type="hidden" id="canvasHeight" value="1120" />
                      <div class="form-row">
                          <div class="form-group col-md-6">
                              <label for="paddingLeft">Left and Right margin:</label>
                              <input class="form-control" id="paddingLeft" type="number" value="10" onchange="change()" /><br />
                          </div>
                          <div class="form-group col-md-6">
                              <label for="paddingTop">Top and bottom margin:</label>
                              <input class="form-control" id="paddingTop" type="number" value="15" onchange="change()" /><br />
                          </div>
                      </div>
                      <div class="form-row">
                          <div class="form-group">
                              Zoom:
                          </div>
                          <div class="form-group btn-group col-md-4" role="group" aria-label="Zoom">
                              <input class="form-control btn btn-secondary" id="zoomOut" type="button" value="-" onclick="zoom('minus')">
                              <input class="form-control btn btn-secondary" id="zoomIn" type="button" value="+" onclick="zoom('plus')">
                          </div>
                      </div>
                      <div class="form-row">
                          <div class="form-group col-md-6">
                              <label for="linesPerPage">Lines per page:</label>
                              <input class="form-control" id="linesPerPage" type="number" value="8" onchange="change()" /><br />
                          </div>
                          <div class="form-group col-md-6">
                              <label for="barsPerLine">Bars per line:</label>
                              <input class="form-control" id="barsPerLine" type="number" value="4" onchange="change()" /><br />
                          </div>
                      </div>
                      <div class="form-row">
                          <div class="form-group col-md-6">
                              <label for="lineSpacing">Line spacing:</label>
                              <input class="form-control" id="lineSpacing" type="number" value="10" onchange="change()" /><br />
                          </div>
                          <div class="form-group col-md-6">
                              <label for="fontSize">Font size:</label>
                              <input class="form-control" id="fontSize" type="number" value="10" onchange="change()" /><br />
                          </div>
                      </div>
                    </div>
                    <?php if ($form) {
                      $head = false;
                      include($form);
                    } ?>
            </div>
        </form>
    </div>
</div>
