import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3; // Move the camera farther back

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// Cube with wood texture
const woodTexture = textureLoader.load('textures/Stylized_Wood_Floor_001_basecolor.png');
const woodMaterial = new THREE.MeshBasicMaterial({ map: woodTexture });
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), woodMaterial);
cube.position.x = -1.5; // Move the cube to the left
scene.add(cube);

// Sphere with stone texture
const stoneTexture = textureLoader.load('textures/Stylized_Stone_Floor_010_basecolor.png');
const stoneMaterial = new THREE.MeshBasicMaterial({ map: stoneTexture });
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), stoneMaterial);
sphere.position.x = 1.5; // Move the sphere to the right
scene.add(sphere);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.y += 0.01;
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
