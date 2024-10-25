import * as THREE from "three";
import gsap from "gsap";

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("scene").appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

cube.position.x=-2;
scene.add(cube);

// Position the camera
camera.position.z = 5;

// Animate cube position
gsap.to(cube.position, {
    duration: 2,
    x: 2,
    repeat: -1,
    yoyo: true
});

// Animate cube rotation
gsap.to(cube.rotation, {
    duration: 2,
    y: Math.PI * 2,
    repeat: -1,
    yoyo: true
});


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    //console.log("TEST");
    //cube.rotation.x += 0.01; // Rotate cube
    renderer.render(scene, camera);
}

animate();
