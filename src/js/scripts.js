import * as THREE from 'three';
import { DoubleSide, GridHelper } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';


// to add 3d model
const blackTshirtUrl = new URL('../assets/tshirt.glb', import.meta.url);


const renderer = new THREE.WebGL1Renderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// for scene and background color
const backgroundColor = {
    color: '#10121e'
};
const scene = new THREE.Scene();
scene.background = new THREE.Color(backgroundColor.color);

// for camera
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
);

// orbital controls
const orbit = new OrbitControls(camera, renderer.domElement);

// camera.position.set(0,200,150);
// camera.position.set(0, 0, 40);
camera.position.set(0, 40, 70);

// to update poistion in the orbit every second
orbit.update();


//background color
// renderer.setClearColor(0x00ff69);


// for text
// test canvas
var canvas1 = document.createElement('canvas');
var context1 = canvas1.getContext('2d');

context1.font = "Bold 20px Garamond";
context1.fillStyle = "rgba(255, 0, 0, 1)";
context1.fillText('ZIGY', 0, 80);

// canvas contents will be used for a texture
var texture1 = new THREE.Texture(canvas1)
texture1.needsUpdate = true;
console.log(texture1);

var material1 = new THREE.MeshBasicMaterial({ map: texture1, side: THREE.DoubleSide });
material1.transparent = true;

var mesh1 = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 10),
    material1
);
mesh1.position.set(21, 14, 3.8);
console.log( mesh1);
// console.log( sphere);



scene.add(mesh1);





const ambientLight = new THREE.AmbientLight(0xededed, 0.8);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF,1);


// dat.gui for display on page
const gui = new dat.GUI();




// to load 3d model 
const option = {
    'Shirt': 0x1818e3
}



const assetLoader = new GLTFLoader();

assetLoader.load(blackTshirtUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    console.log(model);


    const orbitShirt = new OrbitControls(model, renderer.domElement);
    orbitShirt.update();

    


    // model.multiplyScaler(10);
    model.scale.setScalar(1 / 3)


    // gbl gui

    var de2ra = function (degree) { return degree * (Math.PI / 180); };
    var controller = new function () {

        this.scale = (1, 1, 1);
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
    }();

    const shirtFolder = gui.addFolder('Shirt');
    shirtFolder.addColor(option, 'Shirt').onChange(function (e) {
        model.getObjectByName('Object_3').material.color.setHex(e);
        model.getObjectByName('Object_2').material.color.setHex(e);
    });
    shirtFolder.add(controller, 'scale', 0.1, 5).onChange(function (e) {
        model.scale.x = (e);
        model.scale.y = (e);
        model.scale.z = (e);

    });

    var positionFolder = shirtFolder.addFolder('Position');
    positionFolder.add(controller, 'positionX', 0, innerWidth).onChange(function () {
        model.position.x = (controller.positionX);
    });
    positionFolder.add(controller, 'positionY', -22, innerHeight).onChange(function () {
        model.position.y = (controller.positionY);
    });
    positionFolder.add(controller, 'positionZ', -40, innerHeight + innerWidth).onChange(function () {
        model.position.z = (controller.positionZ);
    });

    var rotationFolder = shirtFolder.addFolder('Rotation');
    rotationFolder.add(controller, 'rotationX', 0, 360).onChange(function () {
        model.rotation.x = de2ra(controller.rotationX);
    });
    rotationFolder.add(controller, 'rotationY', 0, 360).onChange(function () {
        model.rotation.y = de2ra(controller.rotationY);
    });
    rotationFolder.add(controller, 'rotationZ', 0, 360).onChange(function () {
        model.rotation.z = de2ra(controller.rotationZ);
    });

    // model.position.set(0, 6, 1);
    // model.position.set(0, -22, -40);
    model.position.set(0, 0, 0);

}, undefined, function (error) {
    console.error(error);
});



// to change the background color of the scene

const b1 = gui.addFolder('Background');

b1.addColor(backgroundColor, 'color').onChange(function (e) {

    scene.background.set(e);

});



// another way to add text
// to change color
const customText = {
        fillStyle: 0x00ff00,
        text: 'ZIGY',
        scale : (1, 1, 1),
        positionX : 0,
        positionY : 0,
        positionZ : 0,
        rotationX : 0,
        rotationY : 0,
        rotationZ : 0
        
    };

    const textFolder = gui.addFolder('TEXT');

    textFolder.addColor(customText, 'fillStyle').onChange(function (e) {
        mesh1.material.color.set(e);
        
    });
    textFolder.add(customText,'text').onChange(function (e) {
        mesh1.material.setValues(customText.text);
    });

    textFolder.add(customText, 'scale', 1, 5).onChange(function (e) {
        mesh1.scale.x = (e);
        mesh1.scale.y = (e);
        mesh1.scale.z = (e);

    });

    var positionTextFolder = textFolder.addFolder('Positon');
    positionTextFolder.add(customText, 'positionX', 0, innerWidth).onChange(function () {
        mesh1.position.x = (customText.positionX);
    });
    positionTextFolder.add(customText, 'positionY', -22, innerHeight).onChange(function () {
        mesh1.position.y = (customText.positionY);
    });
    positionTextFolder.add(customText, 'positionZ', -40, innerHeight + innerWidth).onChange(function () {
        mesh1.position.z = (customText.positionZ);
    });


// by using TextGeometry

// let finalText = "HELLO";
// const loader = new FontLoader();
// loader.load("../fonts/Roboto_Medium_Regular.json", function(font) {
//     var finalTextGeometry = new TextGeometry(finalText, {
//         font: font,
//         size: 50,
//         height: 5
//     });

//     var finalTextMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, specular: 0xffffff});
//     var finalTextObject = new THREE.Mesh(finalTextGeometry, finalTextMaterial);
//     scene.add(finalTextObject);
//     console.log(finalTextObject);
// });


function animate(time) {
    
    renderer.render(scene, camera);

}

renderer.setAnimationLoop(animate);


// to resize the window when inspect window is resized
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// node_modules/three/examples/fonts/droid/droid_sans_bold.typeface.json