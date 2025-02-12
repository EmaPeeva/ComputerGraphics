// HERE WE WILL STORE OUR COLLISION DETECTION LOGIC 
import * as THREE from 'three';
import { Player } from './player';
import { WorldChunk } from './worldChunk';
import { blocks } from './blocks';

//For helper blocks 
const collisionMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 0.2
  });
  const collisionGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001);
  
  //For contacted blocks
  const contactMaterial = new THREE.MeshBasicMaterial({ 
    wireframe: true, 
    color: 0x00ff00 
});
  const contactGeometry = new THREE.SphereGeometry(0.05, 6, 6);

export class Physics{
    simulationRate=200;
    timestep=1/this.simulationRate;
    accumulator=0;
    gravity=32;

    constructor(scene){
        this.helpers= new THREE.Group();
        scene.add(this.helpers);

    }

    //Moves the physics simulation foward in time by dt 
    update(dt,player,world){
        this.accumulator +=dt;

        while(this.accumulator>=this.timestep){
        this.helpers.clear();
        player.velocity.y -= this.gravity * this.timestep;
        player.applyInputs(this.timestep); // passing the movement keys
        player.updateBoundsHelper();
        this.detectCollisions(player,world);
        this.accumulator -= this.timestep;
        }
    }

    // Main function for collision detection 
    detectCollisions(player, world) {
        player.onGround=false;

        const candidates = this.broadPhase(player, world);
        const collisions = this.narrowPhase(candidates,player);
    
       if (collisions.length > 0) {
         this.resolveCollisions(collisions, player);
        }
      }

      // Search against the world to return all possible blocks the player may be colliding with 
      broadPhase(player,world){
        const candidates=[];
        const extents={
            x:{
                min: Math.floor(player.position.x-player.radius),
                max: Math.ceil(player.position.x + player.radius)
            },
            y:{
                min:Math.floor(player.position.y-player.height),
                max:Math.ceil(player.position.y)
            },
            z:{
                min: Math.floor(player.position.z-player.radius),
                max: Math.ceil(player.position.z + player.radius)
            }

        }
        // Find candidate blocks
        //Loop through all blocks within players extents 
        //If they arent empty,then they are a possible collision candidate 
        for(let x=extents.x.min; x<=extents.x.max;x++){
            for(let y=extents.y.min; y<=extents.y.max;y++){
                for(let z=extents.z.min; z<=extents.z.max;z++){
                    const block=world.getBlock(x,y,z);
                    if(block && block.id !== blocks.empty.id){
                        const blockPos={x,y,z};
                        candidates.push(blockPos); //push it to the array of candidates
                        this.addCollisionHelper(blockPos);
                    }
            
                }
            }
        }
        console.log(`Broadphase Candidates: ${candidates.length}`);
        
        return candidates;
      }

      // Narrows down the blocks found in the broad-phase to the set  of blocks the player is actually colliding with

      narrowPhase(candidates, player) {
        const collisions = [];
    
        for (const block of candidates) {
            const p = player.position;
    
            // Get the point on the block that is closest to the center of the player's bounding cylinder
            const closestPoint = {
                x: Math.max(block.x - 0.5, Math.min(p.x, block.x + 0.5)),
                y: Math.max(block.y - 0.5, Math.min(p.y - (player.height / 2), block.y + 0.5)),
                z: Math.max(block.z - 0.5, Math.min(p.z, block.z + 0.5))
            };
    
            // Get distance along each axis between closest point and the center
            const dx = closestPoint.x - p.x;
            const dy = closestPoint.y - (p.y - (player.height / 2));
            const dz = closestPoint.z - p.z;
            
            if (this.pointInPlayerBoundingCylinder(closestPoint, player)) {
                // Compute the overlap between the point and the player's bounding
                // cylinder along the y-axis and in the xz-plane
                const overlapY = (player.height / 2) - Math.abs(dy);
                const overlapXZ = player.radius - Math.sqrt(dx * dx + dz * dz);
        
            
             // Compute the normal of the collision (pointing away from the contact point)
              // and the overlap between the point and the player's bounding cylinder
            let normal, overlap;
            if (overlapY < overlapXZ) {
            normal = new THREE.Vector3(0, -Math.sign(dy), 0);
            overlap = overlapY;
            player.onGround = true;
            } 
            else {
            normal = new THREE.Vector3(-dx, 0, -dz).normalize();
            overlap = overlapXZ;
            }

            //Object of info of collision
            collisions.push({
                block,
                contactPoint: closestPoint,
                normal,
                overlap
              });
              this.addContactPointerHelper(closestPoint);
      
        }
           
        }
        console.log(`Narrowphase Collisions: ${collisions.length}`);
    
        return collisions;
    }

    // Resolves each of the collisions found in the narrow-phase
    resolveCollisions(collisions, player) {
        // Resolve the collisions in order of the smallest overlap to the largest
        collisions.sort((a, b) => {
          return a.overlap < b.overlap;
        });
    
        for (const collision of collisions) {
          // We need to re-check if the contact point is inside the player bounding
          // cylinder for each collision since the player position is updated after
          // each collision is resolved
          if (!this.pointInPlayerBoundingCylinder(collision.contactPoint, player)) continue;
    
          // Adjust position of player so the block and player are no longer overlapping
          let deltaPosition = collision.normal.clone();
          deltaPosition.multiplyScalar(collision.overlap);
          player.position.add(deltaPosition);
    
          // Get the magnitude of the player's velocity along the collision normal
         let magnitude = player.worldVelocity.dot(collision.normal);
          // Remove that part of the velocity from the player's velocity
         let velocityAdjustment = collision.normal.clone().multiplyScalar(magnitude);
    
          // Apply the velocity to the player
          player.applyWorldDeltaVelocity(velocityAdjustment.negate());
        }
      }
    
    //Visualizes the block the player is colliding with
   addCollisionHelper(block) {
    const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
    blockMesh.position.copy(block);
    this.helpers.add(blockMesh);
  }

    //Helper: Returns true if the point 'p' is inside the player's bounding cylinder
    pointInPlayerBoundingCylinder(p, player) {
        const dx = p.x - player.position.x;
        const dy = p.y - (player.position.y - (player.height / 2));
        const dz = p.z - player.position.z;
        const r_sq = dx * dx + dz * dz;
    
        // Check if contact point is inside the player's bounding cylinder
        return (Math.abs(dy) < player.height / 2) && (r_sq < player.radius * player.radius);
      }
      
      //Visualizes the block the player is colliding with
      addCollisionHelper(block) {
        const blockMesh = new THREE.Mesh(collisionGeometry, collisionMaterial);
        blockMesh.position.copy(block);
        this.helpers.add(blockMesh);
      }
    
      // Visualizes the contact at the point 'p'
      addContactPointerHelper(p) {
        const contactMesh = new THREE.Mesh(contactGeometry, contactMaterial);
        contactMesh.position.copy(p);
        this.helpers.add(contactMesh);
      }


}
