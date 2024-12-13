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

const spotlight = new THREE.SpotLight(0xffffff, 2, 10, Math.PI * 0.3);
spotlight.castShadow = true;
spotlight.shadow.mapSize.set(1024, 1024);
spotlight.shadow.camera.near = 1;
spotlight.shadow.camera.far = 6;
spotlight.position.set(-2, 5, 2);
scene.add(spotlight);
scene.add(spotlight.target);

// New Lights
const pointLight = new THREE.PointLight(0xffaa00, 1, 10);
pointLight.castShadow = true;
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft ambient lighting
scene.add(ambientLight);

// Material
const material = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0 });

// Objects
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
cube.castShadow = true;
scene.add(cube);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;
sphere.position.set(-1.5, 0.5, 0);
scene.add(sphere);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.15, 32, 64), material);
torus.castShadow = true;
torus.position.set(1.5, 0.5, 0);
scene.add(torus);

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

    //Animate cube rotation 
    cube.rotation.x = elapsedTime;
    cube.rotation.y = elapsedTime;

    // Animate sphere rotation
    sphere.rotation.y += 0.02;

    // Animate torus rotation
    torus.rotation.x += 0.03;
    torus.rotation.y += 0.03;

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate(); 
