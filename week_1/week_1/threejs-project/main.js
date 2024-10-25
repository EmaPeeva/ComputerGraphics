import * as THREE from 'three';

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('blue'); // Set background color to blue

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a rectangle (plane)
const planeGeometry = new THREE.PlaneGeometry(2, 2); // Width, Height
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }); // Red color
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 1.5, 0); // Position it above the origin
scene.add(plane);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Radius, Width Segments, Height Segments
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-2, 0, 0); // Position to the left
scene.add(sphere);

// Create a triangle using BufferGeometry
const triangleGeometry = new THREE.BufferGeometry();
const triangleVertices = new Float32Array([
    0, 1, 0,   // Vertex 1
   -1, -1, 0, // Vertex 2
    1, -1, 0   // Vertex 3
]);
triangleGeometry.setAttribute('position', new THREE.BufferAttribute(triangleVertices, 3));
const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
triangle.position.set(2, 0, 0); // Position to the right
scene.add(triangle);

// Create a torus
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100); // Radius, Tube Radius, Radial Segments, Tubular Segments
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow color
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, -2, 0); // Position below
scene.add(torus);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Apply transformations to the plane
    plane.rotation.y += 0.01;   // Rotate the plane
    plane.position.x = Math.sin(Date.now() * 0.001) * 2; // Move the plane left and right

    // Apply transformations to the sphere
    sphere.rotation.x += 0.01;  // Rotate the sphere
    sphere.position.y = Math.sin(Date.now() * 0.005) * 2; // Move the sphere up and down

    // Apply transformations to the triangle
    triangle.rotation.z += 0.01; // Rotate the triangle
    triangle.scale.x = 1 + Math.sin(Date.now() * 0.002) * 0.5; // Scale the triangle in X direction
    triangle.scale.y = 1 + Math.sin(Date.now() * 0.002) * 0.5; // Scale the triangle in Y direction

    // Apply transformations to the torus
    torus.rotation.y += 0.01;    // Rotate the torus
    torus.scale.set(1 + Math.sin(Date.now() * 0.001) * 0.2, 1 + Math.sin(Date.now() * 0.001) * 0.2, 1); // Scale the torus

    renderer.render(scene, camera); // Render the scene
}

// Start the animation
animate();
