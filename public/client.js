import * as THREE from 'three';
import { MapControls } from '/jsm/controls/OrbitControls.js';
import { map0_data, loadMap } from './map.js';
import { TowerManager } from './towermanager.js';
import { createTowerGui_open, createTowerGui_close, infoTowerGui_open, infoTowerGui_close } from './gui.js';

// Basic Threejs variables
var scene;
var camera;
var renderer;
var clock;
var controls;

var cube;

var cursor_cube = undefined;
var tower_mesh = undefined;		// ThreeJS Mesh - TOWER

var towerMngr = new TowerManager();

// RAYCASTER
var raycaster;
var mouse = new THREE.Vector2();
var clickableObjs = new Array();
var cursorValid = false;

function init() {
    clock = new THREE.Clock();
    scene = new THREE.Scene();

    raycaster = new THREE.Raycaster();

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

    //cursor
    const corsor_material = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0, color: 0xc0392b });
    const cursor_geometry = new THREE.BoxGeometry(0.5, 4, 0.5);
    cursor_cube = new THREE.Mesh(cursor_geometry, corsor_material);
    scene.add(cursor_cube);

    // TOWER MESH
    const material = new THREE.MeshLambertMaterial({ color: 0xc0392b });
    const tower_geometry = new THREE.BoxGeometry(1, 3, 1);
    tower_mesh = new THREE.Mesh(tower_geometry, material);

    //event
    document.addEventListener('pointerdown', onMouseDown, false);
    document.addEventListener('pointerup', onMouseUp, false);
    renderer.domElement.addEventListener('pointerdown', onMouseDown, false);
    renderer.domElement.addEventListener('pointerup', onMouseUp, false);

    document.getElementById("buttonyes").addEventListener('click', function () {
        event.stopPropagation();

        var tmpTower = towerMngr.newTowerMeshToCreate;
        scene.add(tmpTower);
        towerMngr.addTower(tmpTower);

        towerMngr.newTowerMeshToCreate = undefined;
        createTowerGui_close();
    });

    document.getElementById("buttonno").addEventListener('click', function () {
        event.stopPropagation();
        towerMngr.newTowerMeshToCreate = undefined;
        createTowerGui_close();
    });

    document.getElementById("buttondelete").addEventListener('click', function () {
        event.stopPropagation();
        towerMngr.deleteTower(towerMngr.selectedTower);
        scene.remove(towerMngr.selectedTower.mesh);

        infoTowerGui_close();
        towerMngr.selectedTower = undefined;
    });

    document.getElementById("buttonclose").addEventListener('click', function () {
        event.stopPropagation();
        infoTowerGui_close();
    });

    // ---------------- LIGHTS ----------------
    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(- 1, 0.9, 0.4);
    scene.add(directionalLight);

    loadMap(map0_data, scene, clickableObjs);

    render();
}

function render() {
    var delta = clock.getDelta();            //get delta time between two frames
    var elapsed = clock.elapsedTime;    //get elapsed time
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    renderer.render(scene, camera);     // We are rendering the 3D world
    requestAnimationFrame(render);    // we are calling render() again,  to loop
}

function onMouseUp(event) {
    cursor_cube.material.emissive.g = 0;
    towerMngr.newTowerMeshToCreate = undefined;
    towerMngr.selectedTower = undefined;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    if (cursorValid) {
        var checkTower = towerMngr.getTowerAtPosition(cursor_cube.position.x, cursor_cube.position.z);

        if (checkTower == null) {
            var newtower = tower_mesh.clone();
            newtower.position.set(cursor_cube.position.x, 1, cursor_cube.position.z);
            towerMngr.newTowerMeshToCreate = newtower;

            infoTowerGui_close();
            createTowerGui_open();
        }
        else {
            towerMngr.selectedTower = checkTower;
            createTowerGui_close();
            infoTowerGui_open(checkTower.mesh.position.x, checkTower.mesh.position.z);
        }
    }
}

function onMouseDown(event) {
    event.preventDefault()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(clickableObjs);

    if (intersects.length > 0) {
        var selectedBloc = intersects[0].object;
        cursor_cube.position.set(selectedBloc.position.x, selectedBloc.position.y, selectedBloc.position.z);
        cursor_cube.material.opacity = 0.5;
        cursor_cube.material.emissive.g = 0.5;

        cursorValid = true;
    }
    else {
        cursor_cube.material.opacity = 0;
        cursorValid = false;
    }
}

init();
