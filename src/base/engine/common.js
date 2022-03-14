// const THREE = require('../../.vuepress/js/three')
// const TWEEN = require('../../.vuepress/js/tween')
// const dat = require('../../.vuepress/js/dat.gui.min.js')
// const Stats = require('../../.vuepress/js/stats.min.js')
// import * as THREE from 'three'
// const TWEEN = require('../../.vuepress/js/tween')
// const dat = require('../../.vuepress/js/dat.gui.min.js')
// const Stats = require('../../.vuepress/js/stats.min.js')

let defaultOptions={}
export let ENUM = {
    '对象': 'initGeometry',
    "材质": 'initMaterial',
    "模型": "initModel",
    "场景": "initScene",
    "initTween1": "initTween",
    "灯光": "initLight",
    "相机": "initCamera",
    "渲染器": "initRender",
    "状态": "initStats",
    "挂载": "mountElement",
    "GUI": "CreateGUI",
    "动画": "animate",
    "窗口": "onresize"
}
export let geometryName = {
    '几何体':['Geometry',{point:[0,0,0],color:0xFF0000},{point:[0,0,200],color:0x00FF00},{point:[100,0,100*Math.sqrt(3)],color:0x00FF00}],
    '长方体': ['BoxGeometry',10,10,10],
    '球体': ['SphereGeometry',60, 40, 40],
    '圆柱': ['CylinderGeometry',100, 150, 400],
    '正八面体': ['OctahedronGeometry',100],
    '正十二面体': ['DodecahedronGeometry',100],
    '正二十面体': ['IcosahedronGeometry',100],
}
export let materialName = {
    '点材质':['PointsMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }],
    '线基础材质':[ 'LineBasicMaterial',{ vertexColors: true }],
    '虚线材质':[ 'LineDashedMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }],
    '网格基础材质':[ 'MeshBasicMaterial',{vertexColors:THREE.VertexColors, color:0x00FF00,wireframe: false}],
    '网格Lambert材质':[ 'MeshLambertMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }],
    '网格Phong材质':[ 'MeshPhongMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }],
    '网格材质PBR1':[ 'MeshStandardMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }],
    '网格材质PBR2':[ 'MeshPhysicalMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }],
    '网格深度材质':[ 'MeshDepthMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }],
    '网格法向量材质':[ 'MeshNormalMaterial',{wireframe:false}],
    '精灵Sprite材质':[ 'SpriteMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }],
    '自定义着色器材质':[ 'ShaderMaterial',{ color: 0xffffff, side: THREE.DoubleSide, transparent: false, opacity: 0.1 }]
}
export let modelName = {
    '点渲染模式':'Points',
    '点材质':'PointsMaterial',
    '线渲染模式':'Line',
    '闭环线渲染模式':'LineLoop',
    '间断线渲染模式':'LineSegments',
    '线材质1':'LineBasicMaterial',
    '线材质2':'LineDashedMaterial',
    '三角形渲染模式':'Mesh',
    '网格材质1':'MeshBasicMateria',
    '网格材质2':'MeshLambertMaterial',
    '网格材质3':'MeshPhongMaterial',
    '网格材质4':'MeshStandardMaterial',
    '网格材质5':'MeshPhysicalMaterial',
}
export let lightName = {
    '环境光':'AmbientLight',
    '平行光':'DirectionalLight',
    '点光源':'PointLight',
    '聚光灯光源':'SpotLight',
    '基类Light':'PointLight',
}
export let cameraName = {
    '正投影相机': 'OrthographicCamera',
    '透视投影相机': 'PerspectiveCamera',
    '立方相机': 'CubeCamera',
    // '基类Camera': 'OrthographicCamera',
}

export function CreateThree(options) {
        this._initPoint(options)
}
CreateThree.prototype._initPoint = function ({options,methods,mounted}) {
    const vm = this
    if(options.geometryName) {
        Object.keys(geometryName).forEach(name => {
            if(Object.keys(options.geometryName).includes(name)){
                geometryName[name] = options.geometryName[name]
            }
        })
    }

    vm.$options = {...defaultOptions, methods,mounted}
    Object.keys(vm.$options.methods).forEach(name => {
        vm[name] = vm.$options.methods[name].bind(vm)
    })

    vm.$options.mounted.call(vm)
    window.onresize = vm[ENUM.窗口].bind(this)
}
let methods= {
    [ENUM.对象](...params) {
        let name = params.shift()
        if (name === 'Geometry') {
            this.geometry = new THREE[name]()
            params[params.length] = params[0]
            params.forEach(item => {
                console.log('item', item)
                this.geometry.vertices.push(new THREE.Vector3(...item.point))
                this.geometry.colors.push(new THREE.Color(item.color))
            })
        } else {
            this.geometry = new THREE[name](...params)
        }
    },
    [ENUM.材质](name, params) {
        this.material = new THREE[name](params)
    },
    [ENUM.模型](name) {
        if (name === 'LineBasicMaterial') {
            this.model = new THREE[name](this.geometry, this.material, THREE.LineBasicMaterial)
        } else {
            this.model = new THREE[name](this.geometry, this.material)
            this.model.position = new THREE.Vector3(0, 0, 0)
            this.object3d = new THREE.Object3D()
            this.object3d.add(this.model)
            this.object3d.position.z = -1000
            this.object3d.add(new THREE.AxesHelper(800))
        }
    },
    [ENUM.场景]() {
        this.scene = new THREE.Scene()
        this.scene.add(this.$options.object3d ? this.object3d : this.model)
    },
    [ENUM.initTween1](){
        new TWEEN.Tween(this.object3d.rotation).to({ y: 360, z: 360, x: 360 }, 1000000).repeat(Infinity).start();
    },
    [ENUM.灯光](params) {
        params.forEach(item => {
            let light = new THREE[item.light](item.color)
            light.position.set(...item.position)
            this.scene.add(light)
        })
    },
    [ENUM.相机](camera, params) {
        this.camera = new THREE[camera](...params)
        // this.camera.position.z=10
    },
    [ENUM.渲染器](name) {
        this.render = new THREE[name]({
            antialias: false
        })
        this.render.setSize(window.innerWidth, window.innerHeight)
        this.render.setClearColor(0xFFFFFF, 1.0)
        this.render.render(this.scene, this.camera)
    },
    [ENUM.状态]() {
        this.stats = new Stats()
        this.stats.showPanel(0)
        this.stats.domElement.style.position = "absolute"
        this.stats.domElement.style.left = "0px"
        this.stats.domElement.style.bottom = "0px"
    },
    [ENUM.挂载](parent,childrens) {
        childrens.forEach(item => {
            parent.appendChild(item)
        })
    },
    [ENUM.GUI]() {
        this.param = new function () {
            this.fov = 45
        }
        var gui = new dat.GUI
        gui.add(this.param, 'fov', 0, 180).name("视角大小")
    },
    [ENUM.动画]() {
        this.model.rotation.x += 0.01
        this.model.rotation.y += 0.01
        this.render.render(this.scene, this.camera)
        requestAnimationFrame(methods[ENUM.动画].bind(this))
    }
}

Object.keys(methods).forEach(name => {
    CreateThree.prototype[name] = methods[name]
})
CreateThree.prototype[ENUM.窗口] = function () {
    this.render.setSize(window.innerWidth, window.innerHeight);//重设渲染器宽高比
    this.camera.aspect = window.innerWidth / window.innerHeight;//重设相机宽高比
    this.camera.updateProjectionMatrix();// 重新计算投影矩阵
}