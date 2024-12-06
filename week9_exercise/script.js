import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2, 2, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

// Textures
const textureLoader = new THREE.TextureLoader();
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

// Lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.radius = 10;
directionalLight.position.set(2, 3, -2);
scene.add(directionalLight);

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.visible = false; // Set to true to debug
scene.add(directionalLightCameraHelper);

const spotlight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI * 0.3);
spotlight.castShadow = true;
spotlight.shadow.mapSize.set(1024, 1024); // High shadow resolution
spotlight.shadow.camera.near = 1;
spotlight.shadow.camera.far = 6;
spotlight.position.set(-2, 5, 2);
scene.add(spotlight);
scene.add(spotlight.target);

const spotlightCameraHelper = new THREE.CameraHelper(spotlight.shadow.camera);
spotlightCameraHelper.visible = false; // Set to true to debug
scene.add(spotlightCameraHelper);

// Material
const material = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0 });

// Objects
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
cube.castShadow = true;
scene.add(cube);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
scene.add(plane);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Resize handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const clock = new THREE.Clock();

function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Animate cube position
    cube.position.x = Math.cos(elapsedTime) * 1.5;
    cube.position.z = Math.sin(elapsedTime) * 1.5;
    cube.position.y = Math.abs(Math.sin(elapsedTime * 3));

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();
