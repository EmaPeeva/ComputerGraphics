import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(5, 10,5);
const count = 30;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 2 * 2; i++) {
    positionsArray[i] = (Math.random() - 0.5) * 3;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshPhongMaterial({ color: 0xFF69B4, wireframe: false });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const pointLight = new THREE.PointLight(0xffffff, 0.4);
pointLight.position.set(0.3, 0.3, 0.3);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambientLight);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {

    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 3, 5); 

scene.add(camera);

const controls = new OrbitControls(camera, document.body);
controls.enableDamping = false;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

const tick = () => {

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01; 

    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(tick);
};

tick();