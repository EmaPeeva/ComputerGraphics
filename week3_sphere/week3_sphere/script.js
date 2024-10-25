import * as THREE from 'three';

// First I set up the scene (this is where everything in our 3D world will go)
const scene = new THREE.Scene();

// Than the camera (this is like our eyes in the 3D world)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// We need now the renderer (this will draw everything on the screen)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Make the drawing area the same size as the window
document.body.appendChild(renderer.domElement); // Attach the canvas to the webpage

// Make the background color black
renderer.setClearColor(0x000000, 1);

// The sphere's shape (a ball with width, height, and detail)
const geometry = new THREE.SphereGeometry(1, 32, 32);

// The sphere's material (this is how the sphere will look)
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,  // Set the sphere's lines to white
    wireframe: true   // Show the sphere as a "wireframe" (just lines, no solid surface)
});

// Now, we put the shape and material together to create the sphere
const sphere = new THREE.Mesh(geometry, material);

// Add the sphere to the scene (so we can see it)
scene.add(sphere);

// Move the camera back a bit so we can see the whole sphere
camera.position.z = 5;

// Create an animation function to make the sphere rotate
function animate(time) {
    requestAnimationFrame(animate); // This keeps the animation going

    // Make the sphere rotate left and right (around the Y-axis)
    sphere.rotation.y = time / 3000; // Slow down the rotation by increasing the divisor

    renderer.render(scene, camera); // Draw everything (the scene and the camera)
}

// Finally, we start the animation
animate();
