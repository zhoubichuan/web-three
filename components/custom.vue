<template>
  <div ref="example"></div>
</template>

<script>
export default {
  name: "WebThree1",
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    // 对象
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    // 材质
    var material = new THREE.MeshNormalMaterial({ wireframe: false });
    // 模型
    var mesh = new THREE.Mesh(geometry, material);
    // 场景
    var scene = new THREE.Scene();
    scene.add(mesh);
    // 相机
    let proportion = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(75, proportion, 0.1, 20);
    camera.position.z = 10;
    // 渲染器
    var render = new THREE.WebGLRenderer();
    render.setSize(window.innerWidth / 2, window.innerHeight / 2);
    render.setClearColor(0xffffff);
    render.render(scene, camera);
    // 挂载
    this.$refs.example.appendChild(render.domElement);
    // 动画
    function animate() {
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      requestAnimationFrame(animate);
      render.render(scene, camera);
    }
    animate();
    //窗口尺寸自适应
    window.onresize = function () {
      render.setSize(window.innerWidth / 2, window.innerHeight / 2);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
  },
};
</script>