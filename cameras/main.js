// Importing Three.js and OrbitControls
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
camera.position.set(0, 20, 50);
controls.update();

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(10, 10, 10);
scene.add(light);

// Building Materials
const buildingMaterial1 = new THREE.MeshBasicMaterial({ color: 0xcccccc }); // White buildings
const buildingMaterial2 = new THREE.MeshBasicMaterial({ color: 0x0077cc }); // Blue buildings

// Function to create a building
function createBuilding(width, height, depth, x, z, material) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const building = new THREE.Mesh(geometry, material);
    building.position.set(x, height / 2, z);
    scene.add(building);
}

// Buildings - Positioned on the grass
createBuilding(10, 5, 10, -15, 10, buildingMaterial1);  
createBuilding(10, 5, 10, 15, 10, buildingMaterial1); 

// Horizontal building positioned correctly
const horizontalBuilding = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 5), buildingMaterial2); 
horizontalBuilding.position.set(12, 2.5, -17); 
horizontalBuilding.rotation.y = 0; 
scene.add(horizontalBuilding);

// Blue building 1 positioned in empty grass 
createBuilding(5, 5, 10, -15, -10, buildingMaterial2); 

// Ground Materials
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22 }); 
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 }); 

// Grass Plane
const grass = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), grassMaterial);
grass.rotation.x = -Math.PI / 2;
scene.add(grass);

// Road Planes
const roadHorizontal = new THREE.Mesh(new THREE.PlaneGeometry(60, 5), roadMaterial);
roadHorizontal.rotation.x = -Math.PI / 2;
roadHorizontal.position.set(0, 0.01, 0); 
scene.add(roadHorizontal);

const roadVertical = new THREE.Mesh(new THREE.PlaneGeometry(5, 60), roadMaterial);
roadVertical.rotation.x = -Math.PI / 2;
roadVertical.position.set(0, 0.01, 0); 
scene.add(roadVertical);

// Animated Object
const animatedObject = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
animatedObject.position.set(0, 1, 0); 
scene.add(animatedObject);

// GSAP Animation for Object 
function animateObject() {
    // Moving up the vertical road
    gsap.to(animatedObject.position, { x: 0, z: 25, duration: 5, ease: "power1.inOut", onComplete: () => {
        // Moving down the vertical road
        gsap.to(animatedObject.position, { x: 0, z: 0, duration: 5, ease: "power1.inOut", onComplete: () => {
            // Moving to the right on the horizontal road
            gsap.to(animatedObject.position, { x: 25, z: 0, duration: 5, ease: "power1.inOut", onComplete: () => {
                // Moving back to the center on the horizontal road (left)
                gsap.to(animatedObject.position, { x: 0, z: 0, duration: 5, ease: "power1.inOut", onComplete: () => {
                    // Moving left on the horizontal road
                    gsap.to(animatedObject.position, { x: -25, z: 0, duration: 5, ease: "power1.inOut", onComplete: () => {
                        // Moving back to the center on the horizontal road (right)
                        gsap.to(animatedObject.position, { x: 0, z: 0, duration: 5, ease: "power1.inOut", onComplete: () => {
                            // Moving back down the vertical road (downward)
                            gsap.to(animatedObject.position, { x: 0, z: -25, duration: 5, ease: "power1.inOut", onComplete: () => {
                                // Moving back up the vertical road (to center)
                                gsap.to(animatedObject.position, { x: 0, z: 0, duration: 5, ease: "power1.inOut", onComplete: animateObject });
                            }});
                        }});
                    }});
                }});
            }});
        }});
    }});
}

// Starting the animation
animateObject();


// Starting the animation
animateObject();








// Animation and Render Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Resizing Handler
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
 
