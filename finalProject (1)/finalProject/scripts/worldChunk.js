//HERE WE CREATE THE WHOLE MINECRAFT WORLD
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import {RNG} from './rng'; 
import {blocks,resources} from './blocks'; 

//Block building 
const geometry= new THREE.BoxGeometry();

//Creating the world of blocks
export class WorldChunk extends THREE.Group{
    data=[];  // id: the array will contain what each box (X,Y,Z locations), instanceId: reference to actual mesh instance at that location 
    
    
    constructor( size,params,dataStore){
        super(); 
        this.loaded=false;
        this.size=size;
        this.params=params;
        this.dataStore=dataStore;
    }

    // Will generate the world data and meshes
    generate(){
        const start=performance.now();
        //Generate random number for seed 
        const rng=new RNG(this.params.seed);
        this.initializeTerrain();
        this.generateResources(rng);
        this.generateTerrain(rng);
        this.loadPlayerChanges();
        this.generateMeshes();
        this.loaded=true;

      //  console.log(`LOADED CHUNK IN ${performance.now()- start}ms`);
    }
     
    //Initialize the world terrain data
    initializeTerrain(){
        this.data=[]; //clear the data array and reset the world
        for(let x=0; x<this.size.width; x++){
            const slice=[];
            for(let y=0; y<this.size.height; y++){
                const row=[];
                for(let z=0; z<this.size.width;z++){
                    row.push({ // building the world row by row, object of blcok
                        id:blocks.empty.id, //initialize blocks to empty 
                        instanceId:null
                    });
                }
                slice.push(row); // take all the rows
            }
            this.data.push(slice);
        }
    }

    // Generating the resources (stone,coal..) for the world
    generateResources(rng){
        const simplex=new SimplexNoise(rng); //random number generator
        resources.forEach(resouce=>{
        for(let x=0; x<this.size.width;x++){
            for(let y=0; y<this.size.height;y++){
                for(let z=0; z<this.size.width;z++){
                    const value=simplex.noise3d(
                        (this.position.x + x)/resouce.scale.x,
                        (this.position.y + y)/resouce.scale.y,
                        (this.position.z + z)/resouce.scale.z); //control size of blobs
                    if(value>resouce.scarcity){
                        this.setBlockId(x,y,z,resouce.id);
                    }
                }
            }
        }
    });

    }
    
    //Will generate the terrain noise so we create valleys, mountains etc.
    generateTerrain(rng){
        //Simplex noise function:
        const simplex=new SimplexNoise(rng); //random number generator
        for(let x=0; x<this.size.width;x++){
            for(let z=0; z<this.size.width;z++){

                // Computing the noise value at this x-z loocation
                const value=simplex.noise(
                    (this.position.x + x) / this.params.terrain.scale, //we use the params we defined above
                    (this.position.z + z) / this.params.terrain.scale,
                ); 

                //Scale the noise based on magnitude/offset
                const scaledNoise=this.params.terrain.offset + 
                this.params.terrain.magnitude * value;

                //computing the height of the terrain at this x-z location
                let height= Math.floor(this.size.height * scaledNoise);

                //clamping height between 0 and max height
                height=Math.max(0,Math.min(height,this.size.height-1));

                //fill in all blocks at or below the terrain height
                for(let y=0;y<=this.size.height;y++){
                    if(y<height && this.getBlock(x,y,z).id === blocks.empty.id){ // everything below height will be dirt
                        this.setBlockId(x,y,z,blocks.dirt.id);
                    }
                    else if(y===height){ //everything at same heights will be grass
                        this.setBlockId(x,y,z,blocks.grass.id);
                    }
                    else if(y>height){
                        this.setBlockId(x,y,z,blocks.empty.id);
                    }
                }
            }
        }
    }

    // Pulls any changes from the data store and applies them to the data model
  loadPlayerChanges() {
    for (let x = 0; x < this.size.width; x++) {
      for (let y = 0; y < this.size.height; y++) {
        for (let z = 0; z < this.size.width; z++) {
          if (this.dataStore.contains(this.position.x, this.position.z, x, y, z)) {
            const blockId = this.dataStore.get(this.position.x, this.position.z, x, y, z);
            this.setBlockId(x, y, z, blockId);
          }
        }
      }
    }
  }


    //Will generate 3D represenation of the world from world data 
    generateMeshes(){

        //clear all existing child objects, so we dynamically change the world height/width
        this.clear();

        const maxCount= this.size.width * this.size.width * this.size.height;

        // Creating lookup table where the key is block id 
        const meshes={};

        Object.values(blocks)
            .filter(blockType=>blockType.id !== blocks.empty.id)
            .forEach(blockType=>{
                const mesh=new THREE.InstancedMesh(geometry,blockType.material, maxCount);
               mesh.name=blockType.id;
                mesh.count=0; //current number of instances we have 
                mesh.castShadow=true; //ENABLING SHADOWS
                mesh.receiveShadow=true;
                meshes[blockType.id]=mesh;
            });

        //we'll use instancing in our app to improve performance
        //total number of blocks:
       
    

        const matrix=new THREE.Matrix4(); // stores positions of each block
        for(let x=0; x<this.size.width;x++){
            for(let y=0; y<this.size.height;y++){
                for(let z=0;z<this.size.width;z++){
                    const blockId=this.getBlock(x,y,z).id;
                    
                    if(blockId === blocks.empty.id) continue;
                    const mesh= meshes[blockId];
                    const instancedId=mesh.count;
                    

                    if(!this.isBlockObscured(x,y,z)){
                  matrix.setPosition(x,y,z); 
                  mesh.setMatrixAt(instancedId,matrix); // setting matrix for each block
                  this.setBlockInstanceId(x,y,z,instancedId); 
                  mesh.count++; //next available instance
                    }
                }
            }
         }

         //add blocks to world
         this.add(...Object.values(meshes)); //all instance meshes 
    }

    //Helper Methods



    //Gets the block data at (x,y,z)
    getBlock(x,y,z){        
        if(this.inBounds(x,y,z)){   
            return this.data[x][y][z];
        }
        else{
            return null;
        }
    }

    //Adds a new block at (x,y,z) of type `blockId`
    addBlock(x, y, z, blockId) {
        if (this.getBlock(x, y, z).id === blocks.empty.id) {
          this.setBlockId(x, y, z, blockId);
          this.addBlockInstance(x, y, z);
        this.dataStore.set(this.position.x, this.position.z, x, y, z, blockId);
        }
      }

    //Removes blosk at xyz
    removeBlock(x, y, z) {
        const block = this.getBlock(x, y, z);
        if (block && block.id !== blocks.empty.id) { //if there is block
          this.deleteBlockInstance(x, y, z); //remove it
          this.setBlockId(x, y, z, blocks.empty.id); //   
          this.dataStore.set(this.position.x, this.position.z, x, y, z, blocks.empty.id);
        }
      }


// Removes the mesh instance associated with `block` by swapping it with the last instance and decrementing the instance count.
      deleteBlockInstance(x, y, z) {
        const block = this.getBlock(x, y, z);
    
       if(block.instanceId===null) return;
        //if (block.id === blocks.empty.id || block.instanceId === null) return;
    
        // Get the mesh and instance id of the block
        const mesh = this.children.find((instanceMesh) => instanceMesh.name === block.id);
        
        const instanceId = block.instanceId;  
        // Swapping the transformation matrix of the block in the last position
        // with the block that we are going to remove
        const lastMatrix = new THREE.Matrix4();
        mesh.getMatrixAt(mesh.count - 1, lastMatrix);
    
        // Updating the instance id of the block in the last position to its new instance id
        const v = new THREE.Vector3();
        v.applyMatrix4(lastMatrix);
        this.setBlockInstanceId(v.x, v.y, v.z, instanceId);
    
        // Swapping the transformation matrices
        mesh.setMatrixAt(instanceId, lastMatrix);
    
        // This effectively removes the last instance from the scene
        mesh.count--;
    
        // Notify the instanced mesh we updated the instance matrix
        // Also re-compute the bounding sphere so raycasting works
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
    
        // Remove the instance associated with the block and update the data model
        this.setBlockInstanceId(x, y, z, null);
        
      }

      //Create a new instance for the block at (x,y,z)
      addBlockInstance(x, y, z) {
        const block = this.getBlock(x, y, z);
    
        // Verify the block exists, it isn't an empty block type
        if (block && block.id !== blocks.empty.id && block.instanceId === null ) {
          // Get the mesh and instance id of the block
          const mesh = this.children.find((instanceMesh) => instanceMesh.name === block.id);
          const instanceId = mesh.count++;
          this.setBlockInstanceId(x, y, z, instanceId);
    
          // Compute the transformation matrix for the new instance and update the instanced
          const matrix = new THREE.Matrix4();
          matrix.setPosition(x, y, z);
          mesh.setMatrixAt(instanceId, matrix);
          mesh.instanceMatrix.needsUpdate = true;
       //   mesh.computeBoundingSphere();
        }
      }

    //Sets the block id for the block at (x,y,z)
    setBlockId(x,y,z,id){
        if(this.inBounds(x,y,z)){
            this.data[x][y][z].id=id;
        }
    }


    // Sets block instance id for the block at (x,y,z)
    setBlockInstanceId(x,y,z,instanceId){
        if(this.inBounds(x,y,z)){
            this.data[x][y][z].instanceId=instanceId;
        }
    }


    //Checks if (x,y,z) coordinates are within bounds 
    //takes coordinates and returns true if cordinates are withing bounds of our data array
    inBounds(x,y,z){        
        if(
            x>=0 && x<this.size.width &&
            y>=0 && y<this.size.height &&
            z>=0 && z<this.size.width ){
                return true;
            }
            else{
                return false;
            }
    }


    // Stop rendering blocks that user can't see
    //Returns true if block is completrly hidden by other blocks
    isBlockObscured(x,y,z){
        // getting id of each block that is at x,y,z
        const up= this.getBlock(x,y+1,z)?.id ?? blocks.empty.id;
        const down= this.getBlock(x,y-1,z)?.id ?? blocks.empty.id;
        const left= this.getBlock(x+1,y,z)?.id ?? blocks.empty.id;
        const right= this.getBlock(x-1,y,z)?.id ?? blocks.empty.id;
        const forward= this.getBlock(x,y,z+1)?.id ?? blocks.empty.id;
        const back= this.getBlock(x,y,z-1)?.id ?? blocks.empty.id;

        //If  any of block's sides is exposet,is not obscured
        if(up=== blocks.empty.id ||
            down=== blocks.empty.id ||
            left=== blocks.empty.id ||
            right=== blocks.empty.id ||
            forward=== blocks.empty.id ||
            back=== blocks.empty.id){
                return false;
            }
            else{
                return true;
            }

    }
    
  disposeInstances() {
    this.traverse((obj) => {
      if (obj.dispose) obj.dispose();
    });
    this.clear();
  }
}