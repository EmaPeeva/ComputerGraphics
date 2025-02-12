// HERE WE WILL CREATE THE PLAYER-FIRST PERSON VIEW
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'; 
import { World } from './world';
import { Vector3 } from 'three/webgpu';
import { WorldChunk } from './worldChunk';
import { blocks } from './blocks';
import { Tool } from './tool';

//to not need to define new vector for each screen
const CENTER_SCREEN=new THREE.Vector2();

//We will use Pointer Lock API  which will provide input methods based on movment of mouse 

export class Player{
  //Bounding cylinder of player
    radius=0.5;
    height=1.75;
    jumpSpeed=10;
    onGround=false;
    maxSpeed=10;
    input=new THREE.Vector3(); //direction in which player should move based on key pressed
    velocity= new  THREE.Vector3();
    #worldVelocity=new THREE.Vector3();

    camera= new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight, 0.1,200);
    controls= new PointerLockControls(this.camera,document.body);
    cameraHelper= new THREE.CameraHelper(this.camera);

    //Building the raycasting
    raycaster=new THREE.Raycaster(new THREE.Vector3(),new THREE.Vector3(),0,3);
    selectedCoords=null;
    activeBlockId=blocks.empty.id;


    //Tool 
    tool=new Tool();

    //Creating Player
    constructor(scene){
        this.camera.position.set(32,16,32);
        scene.add(this.camera);
       // scene.add(this.cameraHelper);

       this.camera.add(this.tool); //the tool to move with camera 
        
        //Creating the controls for player movement
        document.addEventListener('keydown',this.onkeydown.bind(this));
        document.addEventListener('keyup',this.onkeyup.bind(this));

        //Wireframe mesh to visualize the player bounding cylinder
        this.boundsHelper = new THREE.Mesh(
          new THREE.CylinderGeometry(this.radius, this.radius, this.height, 16),
          new THREE.MeshBasicMaterial({ wireframe: true })
        );
       // scene.add(this.boundsHelper);

       // Helper used to highlight the currently active block
    const selectionMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.3,
      color: 0xffffaa
    });
    const selectionGeometry = new THREE.BoxGeometry(1.01, 1.01, 1.01);
    this.selectionHelper = new THREE.Mesh(selectionGeometry, selectionMaterial);
    scene.add(this.selectionHelper);

    
        //document.addEventListener('mousedown', this.onMouseDown.bind(this));
    }
  
    //Returns the velocity of the player in world coordinates
    get worldVelocity() {
      this.#worldVelocity.copy(this.velocity);
      this.#worldVelocity.applyEuler(new THREE.Euler(0, this.camera.rotation.y, 0));
      return this.#worldVelocity;
    }

    update(world){
      this.updateRaycaster(world);
      this.tool.update();

    }

    //Raycaster for picking blocks
    updateRaycaster(world) {
      this.raycaster.setFromCamera(CENTER_SCREEN, this.camera);
      const intersections = this.raycaster.intersectObject(world, true); //will return array of intersections
  
      if (intersections.length > 0) {
        const intersection = intersections[0];
        
        // Get the chunk associated with the selected block
       const chunk = intersection.object.parent;

        // Get the transformation matrix for the selected block(intersected)
       const blockMatrix = new THREE.Matrix4();
       intersection.object.getMatrixAt(intersection.instanceId, blockMatrix);

      //  this.selectedCoords=intersection.object.position;
        this.selectedCoords=chunk.position.clone();
       // Extraxt position from block transf matrix and store in selectedCoords
       this.selectedCoords.applyMatrix4(blockMatrix);

       if(this.activeBlockId !== blocks.empty.id){
        this.selectedCoords.add(intersection.normal);
       }
    
    
        this.selectionHelper.position.copy(this.selectedCoords);
        this.selectionHelper.visible=true;

        
      }
      else{
        this.selectedCoords=null;
        this.selectionHelper.visible=false;
      }

        
  
        
  
       // if (this.activeBlockId !== blocks.empty.id) {
          // If we are adding a block, move it 1 block over in the direction
          // of where the ray intersected the cube
        //  this.selectedCoords.add(intersection.normal);
        //}
  
        //this.selectionHelper.position.copy(this.selectedCoords);
        //this.selectionHelper.visible = true;
     // } else {
       // this.selectedCoords = null;
       // this.selectionHelper.visible = false;
      
    }

    // Applies a change in velocity 'dv' that is specified in the world frame
    applyWorldDeltaVelocity(dv) {
      dv.applyEuler(new THREE.Euler(0, -this.camera.rotation.y, 0));
      this.velocity.add(dv);
    }
  
  

    applyInputs(dt){
        if(this.controls.isLocked){
            console.log(dt);
            this.velocity.x=this.input.x;
            this.velocity.z=this.input.z;
            this.controls.moveRight(this.velocity.x * dt); 
            this.controls.moveForward(this.velocity.z * dt);
            this.position.y += this.velocity.y *dt;

            document.getElementById('player-position').innerHTML=this.toString();
        }

    }

    //Update position of player bounding cylinder helper
    updateBoundsHelper(){
      this.boundsHelper.position.copy(this.position);
      this.boundsHelper.position.y -= this.height/2;
    }

    //helper function of type Vector3
    get position(){
        return this.camera.position;
    }

    //Event handler for keydown event
    onkeydown(event){
        if(!this.controls.isLocked){
            this.controls.lock();
            console.log('controls locked');
        }
        switch(event.code){
          case 'Digit0':
          case 'Digit1':
          case 'Digit2':
          case 'Digit3':
          case 'Digit4':
          case 'Digit5':
            document.getElementById(`toolbar-${this.activeBlockId}`).classList.remove('selected');
            this.activeBlockId = Number(event.key);
            document.getElementById(`toolbar-${this.activeBlockId}`).classList.add('selected');

            //we only want to show the tool when  is selected
            this.tool.visible=(this.activeBlockId===0);

            console.log(`activeBlockedId=${event.key}`)
            break;
            case 'KeyW':
                this.input.z = this.maxSpeed;
                break;
              case 'KeyA':
                this.input.x = -this.maxSpeed;
                break;
              case 'KeyS':
                this.input.z = -this.maxSpeed;
                break;
              case 'KeyD':
                this.input.x = this.maxSpeed;
                break; 
              case 'KeyR': //will set me at starting place
                this.position.set(32,16,32);
                this.velocity.set(0,0,0);
                break;
                case 'Space':
                if (this.onGround) {
                  this.velocity.y += this.jumpSpeed;
                }
                break;
        }
        

    }
    //Event handler for keyup
    onkeyup(event){
        switch(event.code){
            case 'KeyW':
                this.input.z = 0;
                break;
              case 'KeyA':
                this.input.x = 0;
                break;
              case 'KeyS':
                this.input.z = 0;
                break;
              case 'KeyD':
                this.input.x = 0;
                break;
        }
        

    }
    //Position of player to string (x,y,z)
    toString() {
        let str = '';
        str += `X: ${this.position.x.toFixed(3)} `;
        str += `Y: ${this.position.y.toFixed(3)} `;
        str += `Z: ${this.position.z.toFixed(3)}`;
        return str;
      }
}