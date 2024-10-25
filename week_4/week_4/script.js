import * as THREE from 'three';
const scene = new THREE.Scene();

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(5, 5, 5);
scene.add(light);

// scene.add(light);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,         
    shininess: 100,          
    specular: 0x555555        
  });
const box = new THREE.Mesh(boxGeometry, boxMaterial);


const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,         
    shininess: 100,          
    specular: 0x555555        
  });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

const cylinderGeometry = new THREE.CylinderGeometry( 1, 1, 2, 32 );
const cylinderMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff,         
    shininess: 100,          
    specular: 0x555555        
  }); 
const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial ); 

box.position.x = -4;
sphere.position.x = 4;
cylinder.position.z = -10;

scene.add(cylinder);
scene.add(box)
scene.add(sphere)

const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.z = 10;
camera.position.y = 2;
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);

document.getElementById("scene").appendChild(renderer.domElement);

camera.lookAt(sphere.position);

window.addEventListener('resize', (event)=>
{
  camera.aspect = renderer.domElement.width / renderer.domElement.height;
  renderer.setSize(renderer.domElement.width, renderer.domElement.height);

  camera.updateProjectionMatrix();
})

window.addEventListener('keydown', (event) =>
{
    switch(event.key)
    {
      case 'b':
        camera.lookAt(box.position);
        break;
      case 'c':
        camera.lookAt(cylinder.position);
        break;
      case 's':
        camera.lookAt(sphere.position);
        break;
    }
    camera.updateProjectionMatrix();
});

const animate = () =>{
  requestAnimationFrame(animate);
  camera.fov += 1;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera)
}

animate();