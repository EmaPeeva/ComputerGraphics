import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3); // Adjust camera position

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const colorTexture = textureLoader.load('/textures/Stylized_Stone_Floor_010_basecolor.png'); // Ensure correct path
colorTexture.colorSpace = THREE.SRGBColorSpace;
const heightTexture = textureLoader.load('/textures/Stylized_Stone_Floor_010_height.png');
const normalTexture = textureLoader.load('/textures/Stylized_Stone_Floor_010_normal.png');
const ambientOcclusionTexture = textureLoader.load('/textures/Stylized_Stone_Floor_010_ambientOcclusion.png');
const roughnessTexture = textureLoader.load('/textures/Stylized_Stone_Floor_010_roughness.png');

const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    aoMap: ambientOcclusionTexture
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), material);
scene.add(sphere);

// Add a light source
const light = new THREE.PointLight(0xffffff, 20);
light.position.set(2, 2, 2);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();