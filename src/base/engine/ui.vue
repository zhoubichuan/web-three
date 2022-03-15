<template>
  <div id="example">
  </div>
</template>

<script>
import {
  ENUM,
  geometryName,
  materialName,
  modelName,
  lightName,
  cameraName,
  CreateThree,
} from "./common.js";
export default {
  name: "eagleEye",
  mounted() {
    new CreateThree({
      options: {
        geometryName: {
          长方体: ["BoxGeometry", 5, 5, 5],
        },
      },
      methods: {
        [ENUM.相机](camera, params) {
          this.camera = new THREE[camera](...params);
          this.camera.position.z = 10;
        },
      },
      mounted() {
        this[ENUM.对象](...geometryName.长方体);
        this[ENUM.材质](...materialName.网格Phong材质);
        this[ENUM.模型](modelName.三角形渲染模式);
        this[ENUM.场景]();
        this[ENUM.灯光]([
          {
            light: lightName.环境光,
            color: 0xff0000,
            position: [100, 100, 200],
          },
          {
            light: lightName.点光源,
            color: 0x00ff00,
            position: [0, 0, 300],
          },
        ]);
        this[ENUM.相机](cameraName.透视投影相机, [
          45,
          window.innerWidth / window.innerHeight,
          1,
          1000,
        ]);
        this[ENUM.渲染器]("WebGLRenderer");
        this[ENUM.挂载](document.querySelector('.example'), [this.render.domElement]);
        this[ENUM.动画]();
      },
    });
  },
};
</script>

