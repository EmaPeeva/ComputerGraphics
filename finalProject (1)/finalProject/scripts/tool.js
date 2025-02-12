//Tool bar
import * as THREE from 'three';


export class Tool extends THREE.Group {
    //is tool currently animating
    animate= false;
    animationAmplitude=0.5; //amplitude of tool animation
    animationDuration=750; //duration of animation till it stops
    //start time for animation
    animationStart=0;
    animationSpeed=0.025; //speed of tool animation
    animation = undefined; //currently active animation
    toolMesh=undefined; // 3d mesh of actual tool

    //amount of time elapsed since animation started
    get animationTime(){
        return performance.now()- this.animationStart;
    }

    //Start new  animation  of tool
    startAnimation(){
        if(this.animate) return;
     //   console.log('starting tool animation');
        this.animate=true;
        this.animationStart=performance.now();


        //if there is old animation going out, we want to clear it 
        clearTimeout(this.animate);
            
        //we don't want inifiny of animation,we want stopping point
        this.animation=setTimeout(()=> {
        //    console.log('stopping animation');
            this.animate=false;
            this.toolMesh.rotation.y=0;
        },this.animationDuration);
    }
 
    //uopdate animation state at each frame
    update(){
        if(this.animate && this.toolMesh){
           // console.log('animating');
            //make the tool go back and fourth 
            this.toolMesh.rotation.y =this.animationAmplitude *  Math.sin(this.animationTime * this.animationSpeed);
        }
    } 

    //set tool mesh 
    setMesh(mesh){
        this.clear();// clear exsisting tool

        this.toolMesh=mesh;
        this.add(this.toolMesh);
        mesh.reciveShadow=true;
        mesh.castShadow=true;

        this.position.set(0.6,-0.3,-0.5);
        this.scale.set(0.5,0.5,0.5);
        this.rotation.z=Math.PI / 2;
        this.rotation.y=Math.PI + 0.2;
        
    }

}