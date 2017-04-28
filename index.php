
<html>
<head>
  <title>Image ASCII Mapper</title>
</head>
<link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="bootstrap-3.3.7-dist/css/bootstrap.min.css" />
<link rel="stylesheet" type="text/css" href="bootstrap-3.3.7-dist/css/bootstrap-theme.min.css" />
<script src="js/jquery-3.1.1.min.js"></script>
<script src="bootstrap-3.3.7-dist/js/bootstrap.min.js"></script>
<style>
  body {
    text-align: center;
  }

  canvas {
    display: block;
    margin: 0 auto;
    opacity: 0;
    transition: 0.5s ease-in;
    -webkit-transition: 0.5s ease-in;
  }

  h1 {
    font-family: "Inconsolata", sans-serif;
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
    font-variant: small-caps;
  }

  .input-group {
    position: relative;
    width: 70%;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
  }

  .alert {
    display: none;
    width: 70%;
    left: 50%;
    position: relative;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
  }

  #ascii {
    font-family: "Consolas", "Courier New", "serif";
    font-size: 2pt;
    margin: 4em 0em;
    line-height: 0.73em;
    transition: 1s ease-in-out;
    transform: scale(1, 1);
    -webkit-transition: 1s ease-in-out;
    -webkit-transform: scale(1, 1);
  }

  h3 {
    display: none;
  }

  span#status {
    display: block;
    font-style: italic;
  }

  button#zoom {
    display: none;
  }
</style>
<script>
  var canvas, ctx, pixels, mapped, toLoad;

  if(typeof window.chrome == "undefined" || typeof window.chrome.webstore == "undefined") alert("For the fastest results, please use Chrome to view this page.");

  $(function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    $("button#load").click(function() {
      loadImage();
    });

    $("button#zoom").click(function() {
      toggleZoom();
    });
  });

  function loadImage() {
    var url_val = $("#url").val();
    if(url_val != toLoad) {
      toLoad = url_val;

      setStatus("Attempting to load " + toLoad + " ...");

      if($("h3#label_mapped").is(":visible")) {
        $("h3#label_mapped").hide();
        $("button#zoom").hide();
        $("#ascii").text("");
      }

      var image = new Image();
      image.src = toLoad;
      image.onload = function() {
        if(this.complete && typeof this.naturalWidth != "undefined" && this.naturalWidth != 0) {
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          ctx.drawImage(image, 0, 0);
          showCanvas();

          setStatus("Load successful.");
          setStatus("Mapping image...");

          setTimeout(function() {
            mapImage();
            $("h3#label_mapped").hide().show();
            $("button#zoom").hide().show();
            setStatus("Done.");
          }, 0);
        } else {
          setStatus("Error finding image " + toLoad + ".");
        }
      }
    }
  }

  function getMappedValue(scaled) {
    if(scaled == 0) return "&nbsp;";
    if(scaled <= 0.15) return "^";
    if(scaled <= 0.25) return "-";
    if(scaled <= 0.35) return ":";
    if(scaled <= 0.5) return "o";
    if(scaled <= 0.75) return "%";
    if(scaled <= 0.85) return "*";
    if(scaled <= 1) return "#";
  }

  function mapImage() {
    $("#ascii").text("");
    pixels = 0;
    mapped = 0;
    for(var i = 0; i < canvas.height; i++) {
      for(var j = 0; j < canvas.width; j++) {
        var currentData = ctx.getImageData(j, i, 1, 1);
        var scaledData = scaleImageData(currentData);
        var mappedValue = getMappedValue(scaledData);
        $("#ascii").append(mappedValue);
        pixels++;
        mapped = 100 * (pixels / (canvas.height * canvas.width));
        console.log("Mapping image... " + mapped + "% done.");
      }
      $("#ascii").append("<br />");
    }
  }

  function scaleImageData(imageData) {
    var data = imageData.data;
    if(data[3] == 0) return 0;
    var total = (data[3] / 255) * (data[0] + data[1] + data[2]);
    return (765 - total) / 765;
  }

  function setStatus(status) {
    $("#status").text("(" + status + ")");
  }

  function showCanvas() {
    $("canvas").css("box-shadow", "2px 2px 2px rgba(0, 0, 0, 0.3)");
    $("canvas").css("opacity", "1");
    $("h3#label_original").hide().show();
  }

  function toggleZoom() {
    var currentZoom = $("#ascii").css("transform");
    if(currentZoom == "matrix(3, 0, 0, 3, 0, 0)") $("#ascii").css("transform", "scale(1, 1)");
    else $("#ascii").css("transform", "scale(3, 3)");
  }
</script>
<body>
  <h1>Image &rarr; Ascii</h1>
  <hr />
  <div class="input-group">
    <select class="form-control" id="url">
      <option value='images/389801ede7042244cee0825331da34ec.jpg'>389801ede7042244cee0825331da34ec.jpg</option><option value='images/41Q43379MPL.jpg'>41Q43379MPL.jpg</option><option value='images/Falcon_poster_20cm_version.jpg'>Falcon_poster_20cm_version.jpg</option><option value='images/boatman_by_a_windmill_at_sundown-small.jpg'>boatman_by_a_windmill_at_sundown-small.jpg</option><option value='images/collegeboard.jpg'>collegeboard.jpg</option><option value='images/cozz.png'>cozz.png</option><option value='images/elric.jpg'>elric.jpg</option><option value='images/federer.png'>federer.png</option><option value='images/howler.png'>howler.png</option><option value='images/jobs.png'>jobs.png</option><option value='images/sherlock.jpg'>sherlock.jpg</option>    </select>
    <div class="input-group-btn">
      <button class="btn btn-default" id="load"><span class="glyphicon glyphicon-import"></span> Load &amp; Map Image</button>
      <button class="btn btn-default" id="scale"><span class="glyphicon glyphicon-zoom-in"></span> Change Rendering Scale</button>
      <button class="btn btn-default" id="zoom"><span class="glyphicon glyphicon-fullscreen"></span> Toggle Zoom</button>
    </div>
  </div>
  <hr />
  <code id="status">(Waiting for image input...)</code>
  <h3 id="label_original">Original Image</h3>
  <canvas id="canvas"></canvas>
  <h3 id="label_mapped">Mapped Image</h3>
  <div id="ascii">
  </div>
</body>
</html>
