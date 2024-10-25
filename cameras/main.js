import * as THREE from 'three';
const scene = new THREE.Scene();

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(5, 5, 5);
scene.add(light);


const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,         
    shininess: 100,          
    specular: 0x555555        
  });
const box = new THREE.Mesh(boxGeometry, boxMaterial);


const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,         
    shininess: 100,          
    specular: 0x555555        
  });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

const cylinderGeometry = new THREE.CylinderGeometry( 0.5,0.5,8,8 );
const cylinderMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,         
    shininess: 100,          
    specular: 0x555555        
  }); 
const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial ); 

box.position.x = -4;
sphere.position.x = 4;
cylinder.position.z = -30;

scene.add(cylinder);
scene.add(box)
scene.add(sphere)

const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0, 120);

camera.position.z = 10;
camera.position.y = 2;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);

document.getElementById("scene").appendChild(renderer.domElement);

const animate = () =>{
  requestAnimationFrame(animate);
  cylinder.position.x += 0.02;
  console.log("cylinder position");
  renderer.render(scene, camera)
}

animate();