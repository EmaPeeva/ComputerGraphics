import * as THREE from 'three';

const scene = new THREE.Scene();

const emissiveMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc0cb,
    emissive: 0xff69b4,
    emissiveIntensity: 0.8
});

const glowingCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), emissiveMaterial);
scene.add(glowingCube);

const phongMaterial = new THREE.MeshPhongMaterial({
    color: 0xffc0cb,
    specular: 0xff69b4,
    shininess: 100
});
const shiningSphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), phongMaterial);
shiningSphere.position.x = 2;
scene.add(shiningSphere);

const transparentMaterial = new THREE.MeshStandardMaterial({
    color: 0xffc0cb,
    transparent: true,
    opacity: 0.7
});
const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), transparentMaterial);
scene.add(plane);

const transparentBox = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 1), transparentMaterial);
transparentBox.position.x = 1;
scene.add(transparentBox);

const startColor = new THREE.Color(0xff69b4);
const endColor = new THREE.Color(0xffc0cb);

const interpolatedColor = startColor.clone().lerp(endColor, 0.5);
const interpolatedMaterial = new THREE.MeshBasicMaterial({ color: interpolatedColor });
const interpolatedCube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), interpolatedMaterial);
interpolatedCube.position.y = 1;
scene.add(interpolatedCube);

const ambientLight = new THREE.AmbientLight(0xffe4e1, 1.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

const sizes = {
    width: 800,
    height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(2, 3, 5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
document.getElementById("scene").appendChild(renderer.domElement);

renderer.render(scene, camera);
