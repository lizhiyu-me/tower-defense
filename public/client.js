import * as THREE from 'three';
import { MapControls } from '/jsm/controls/OrbitControls.js';
import { map0_data, loadMap } from './map.js';

// Basic Threejs variables
var scene;
var camera;
var renderer;
var clock;
var controls;
// RAYCASTER
var raycaster;
var mouse = new THREE.Vector2();
var clickableObjs = new Array();


function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();

    // ---------------- RENDERER ----------------
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);  // we add the HTML element to the HTML page

    // ---------------- CAMERA ----------------
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 10;
    camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000);
    camera.position.set(-15, 15, -15);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // ---------------- CAMERA CONTROLS ----------------
    controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2;

    // ---------------- LIGHTS ----------------
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(- 1, 0.9, 0.4);
    scene.add(directionalLight);

    loadMap(map0_data, scene);

    render();
}

function render() {
    var delta = clock.getDelta();            //get delta time between two frames
    var elapsed = clock.elapsedTime;    //get elapsed time
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);     // We are rendering the 3D world
    requestAnimationFrame(render);    // we are calling render() again,  to loop
}

init();
