<template>
  <div>
    <div ref="map" class="map"></div>
    <a id="export-png" class="btn btn-default"
      ><i class="fa fa-download"></i> Download PNG</a
    >
    <a id="image-download" download="map.png"></a>
  </div>
</template>
  
  <script>
export default {
  mounted() {
    let {
      format: { GeoJSON },
      Map,
      View,
      layer: { Heatmap: HeatmapLayer, Vector: VectorLayer },
      source: { OSM, Vector: VectorSource },
      style: { Fill, Style },
      color: { asArray },
    } = ol;
    const style = new Style({
      fill: new Fill({
        color: "#eeeeee",
      }),
    });

    const map = new Map({
      layers: [
        new VectorLayer({
          source: new VectorSource({
            url: "https://openlayers.org/data/vector/ecoregions.json",
            format: new GeoJSON(),
          }),
          background: "white",
          style: function (feature) {
            const color = asArray(feature.get("COLOR_NNH") || "#eeeeee");
            color[3] = 0.75;
            style.getFill().setColor(color);
            return style;
          },
        }),
        new HeatmapLayer({
          source: new VectorSource({
            url: this.$withBase("/data/geojson/world-cities.geojson"),
            format: new GeoJSON(),
          }),
          weight: function (feature) {
            return feature.get("population") / 1e7;
          },
          radius: 15,
          blur: 15,
          opacity: 0.75,
        }),
      ],
      target: this.$refs.map,
      view: new View({
        center: [12579156, 3274244],
        zoom: 2,
      }),
    });

    document
      .getElementById("export-png")
      .addEventListener("click", function () {
        map.once("rendercomplete", function () {
          const mapCanvas = document.createElement("canvas");
          const size = map.getSize();
          mapCanvas.width = size[0];
          mapCanvas.height = size[1];
          const mapContext = mapCanvas.getContext("2d");
          Array.prototype.forEach.call(
            map
              .getViewport()
              .querySelectorAll(".ol-layer canvas, canvas.ol-layer"),
            function (canvas) {
              if (canvas.width > 0) {
                const opacity =
                  canvas.parentNode.style.opacity || canvas.style.opacity;
                mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);

                const backgroundColor = canvas.parentNode.style.backgroundColor;
                if (backgroundColor) {
                  mapContext.fillStyle = backgroundColor;
                  mapContext.fillRect(0, 0, canvas.width, canvas.height);
                }

                let matrix;
                const transform = canvas.style.transform;
                if (transform) {
                  // Get the transform parameters from the style's transform matrix
                  matrix = transform
                    .match(/^matrix\(([^\(]*)\)$/)[1]
                    .split(",")
                    .map(Number);
                } else {
                  matrix = [
                    parseFloat(canvas.style.width) / canvas.width,
                    0,
                    0,
                    parseFloat(canvas.style.height) / canvas.height,
                    0,
                    0,
                  ];
                }
                // Apply the transform to the export map context
                CanvasRenderingContext2D.prototype.setTransform.apply(
                  mapContext,
                  matrix
                );
                mapContext.drawImage(canvas, 0, 0);
              }
            }
          );
          mapContext.globalAlpha = 1;
          if (navigator.msSaveBlob) {
            // link download attribute does not work on MS browsers
            navigator.msSaveBlob(mapCanvas.msToBlob(), "map.png");
          } else {
            const link = document.getElementById("image-download");
            link.href = mapCanvas.toDataURL();
            link.click();
          }
        });
        map.renderSync();
      });
  },
};
</script>