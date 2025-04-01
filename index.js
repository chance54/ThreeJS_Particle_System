////////////////////////////////////
// THREE.JS PARTICLE SYSTEM
// CHANCE HOARD 4/2025
// V 0.8.0
////////////////////////////////////

// import from the "import map" (see index.html)
import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
//import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

// set the size of the scene to the window dimensions
const window_w = window.innerWidth;
const window_h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(window_w, window_h);
document.body.appendChild(renderer.domElement);

// CAMERA
// field of view is in degrees
const fov = 75;
// make the camera dimensions equal to the window's 
const aspect = window_w/window_h;
// how close (in meters) before things disappear 
const near = 0.1;
// how far (in meters) before things disappear (set further if things don't look right) 
const far = 10;
// instantiate camera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// set the camera back a bit, so the default 0 0 0  position is visible 
camera.position.z = 6;


// PARTICLE SYSTEM CLASS
class ParticleSystem{
    // CONSTRUCTOR PARAMETERS
    // Amount: Amount of particles to spawn at a time (int)
    // Direcrtion: Direction of the force on the particles. Used to control shape. (int[3])
    // Force: Force on direction of the particles, with gravity disabled the force will be constant and will act as speed. (float)
    // Duration: Lifespan of the particles (int)
    // Colors: Color of the particles; Can be one or many. (0xFormat[])
    // Spawn Delay: Delay in spawnrate of the particle waves, if looping is false this means nothing :) (int)
    // Gradiant: Weather or not the colors will be random or in a grandiant from life to death. (boolean)
    // Looping: Weather or not the Particle System is continuous. (boolean)
    // Gravity: Allows particles to fall at a rate proportional to their mass. (boolean)
    // Mass: Mass of the particle, effects force; fall speed as well when gravity is enabled.

    constructor(amount, geometry, direction, force, duration, colors, spawnDelay, gradiant, looping, gravity, mass){
        this.amount = amount;
        this.geometry = geometry;
        this.direction = direction;
        this.force = force * .05;
        this.duration = duration;
        this.colors = colors;
        this.spawnDelay = spawnDelay;
        this.gradiant = gradiant;
        this.looping = looping;
        this.gravity = gravity;
        this.mass = mass;

        this.particles = []; // Empty list to hold particles once created in Start()

        this.loopTicker = 0; // For use when looping, continuouisly goes up until reaches spawnDelay, then resets back to 0 and climbs again.

        this.Start.bind(this);
        this.Update.bind(this);
        this.spawnParticles.bind(this);
    }

    Start(){
        this.particles = [];
        this.loopTicker = 0;

        if (this.gradiant){
            this.gradiantChangeInterval = Math.floor(this.duration / this.colors.length);
            this.gradiantTicker = 0;
            this.gradiantColor = 0;
        }

        this.spawnParticles();
    }

    Update(){
        if (this.looping){
            this.loopTicker++;
            if (this.loopTicker >= this.spawnDelay){
                this.spawnParticles();
                this.loopTicker = 0;
            }
            //console.log(this.loopTicker);
        }

        if (this.gravity){
            for (let i = 0; i < this.particles.length; i++){
                let gforce = this.mass * 0.0002;
                this.particles[i].velocity[1] -= gforce;
            }
        }

        for (let i = 0; i < this.particles.length; i++){
            this.particles[i].update();
        }


        // Deleting particles after age has surpassed duration.

        if (this.particles[0].age >= this.duration){
            let decayedParticles = [];
            for (let i = 0; i < this.particles.length; i++){
                if (this.particles[i].age >= this.duration){
                    decayedParticles += i;
                }
            }
            for (let i = 0; i < decayedParticles.length; i++){
                scene.remove(this.particles[i].mesh);
            }
            this.particles.splice(0, decayedParticles.length);
        }

        if (this.gradiant){
            if (this.gradiantTicker >= this.gradiantChangeInterval && this.gradiantColor < this.colors.length){
                for (let i = 0; i < this.particles.length; i++){
                    this.gradiantColor++;
                    this.gradiantTicker = 0;
                    this.particles[i].changeMaterial(this.colors[this.gradiantColor]);
                }
            }
            else if (this.gradiantColor >= this.colors.length){
                this.gradiantColor = 0;
            }
            this.gradiantTicker++;
        }

        /*
        for (let i = 0; i < this.particles.length; i++){
            this.particles[i].update();

            if (this.particles[i].age >= this.duration){
                console.log("ded: " + i);
                scene.remove(this.particles[i].mesh);
                this.particles.splice(i);
                break;
            }
        }
            */

        
    }

    spawnParticles(){
        let particleColorTicker = 0;
        let particleColor;
        let particlesInWave = [];
        if (this.colors.length == 1 || this.gradiant){
            particleColor = this.colors[0];
        }
        for (let i = 0; i < this.amount; i++){
            if (this.colors.length > 1 && !this.gradiant){
                particleColorTicker = Math.floor(Math.random()*this.colors.length);
                particleColor = this.colors[particleColorTicker];
            }
            particlesInWave.push(new Particle(this.geometry, particleColor));

                let directionalVector = new THREE.Vector3(Math.random()*this.direction[0]-(this.direction[0]/2), Math.random()*this.direction[1]-(this.direction[1]/2), Math.random()*this.direction[2]-(this.direction[2]/2));
                directionalVector.x *= this.force;
                directionalVector.y *= this.force;
                directionalVector.z *= this.force;
                //console.log(directionalVector);
                particlesInWave[i].addForce(directionalVector.x, directionalVector.y, directionalVector.z);

            
            scene.add(particlesInWave[i].mesh);
        }
        for (let i = 0; i < particlesInWave.length; i++){
            this.particles.push(particlesInWave[i]);
        }
    }

}

class SphereParticleSystem extends ParticleSystem{
    constructor(amount, radius, widthSegments, heightSegments, direction, force, duration, colors, spawnDelay, gradiant, looping, gravity, mass) {
        let sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        super(amount, sphereGeometry, direction, force, duration, colors, spawnDelay, gradiant, looping, gravity, mass);
    }
}

class BoxParticleSystem extends ParticleSystem{
    constructor(amount, width, height, depth, direction, force, duration, colors, spawnDelay, gradiant, looping, gravity, mass){
        let boxGeometry = new THREE.BoxGeometry(width, height, depth);
        super(amount, boxGeometry, direction, force, duration, colors, spawnDelay, gradiant, looping, gravity, mass);
    }
}

class CircleParticleSystem extends ParticleSystem{
    constructor(amount, radius, segments, direction, force, duration, colors, spawnDelay, gradiant, looping, gravity, mass){
        let circleGeometry = new THREE.CircleGeometry(radius, segments);
        super(amount, circleGeometry, direction, force, duration, colors, spawnDelay, gradiant, looping, gravity, mass);
    }
}

// PARTICLE CLASS
class Particle{
    constructor(geometry, particleColor){
        this.geometry = geometry;
        this.particleColor = particleColor;
        this.material = new THREE.MeshBasicMaterial({color: this.particleColor});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.velocity = [0, 0, 0];
        this.age = 0;
    }

    update(){
        this.mesh.position.x += this.velocity[0];
        this.mesh.position.y += this.velocity[1];
        this.mesh.position.z += this.velocity[2];

        this.age++;
    }

    addForce(x, y, z){
        this.velocity[0] = x;
        this.velocity[1] = y;
        this.velocity[2] = z;
    }

    changeMaterial(newColor){
        console.log("helo");
        this.mesh.material.color.setHex(newColor);

    }
}

// SCENE
const scene = new THREE.Scene(); 

// camera orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.5

/*
const cubeGeom = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(cubeGeom, cubeMat);
scene.add(cube);
*/
const hemiLight = new THREE.HemisphereLight(0x8A2BE2, 0xA52A2A);
scene.add(hemiLight);


// Testing particle emmision (ParticleSystem w/o class)
/*
var particles = [];
const particles_n = 2000
for (let i = 0; i < particles_n; i++){
    particles.push(new Particle(.2, 8, 8));
    particles[i].addForce(Math.random()*4-2, Math.random()*.5-.25, Math.random()*.5-.25);
    scene.add(particles[i].mesh);
}

var timePassed = 0;
*/

// CREATING A PARTICLE SYSTEM
const ps1 = new SphereParticleSystem(300, .08, 8, 8, [.5, 2, .5], 1, 500, [0x00CED1, 0x00BFFF, 0x1E90FF, 0x6495ED, 0x00008B], 50, false, true, true, 2);
const ps2 = new BoxParticleSystem(300, .08, .08, .08, [.5, 2, .5], 1, 500, [0xDC143C, 0x8B0000, 0xB22222, 0xFF1493, 0x800000, 0xFF0000], 50, false, true, true, -2);
const ps3 = new CircleParticleSystem(400, .02, 4, [2, 0, 2], .4, 1000, [0x3CB371, 0x00FA9A, 0x98FB98, 0x2E8B57, 0x00FF7F, 0x98FB98], 50, false, true, false, 1);
ps1.Start();
ps2.Start();
ps3.Start();

// ITS A LOOP
function animate(t = 0){

    ps1.Update();
    ps2.Update();
    ps3.Update();


requestAnimationFrame(animate);
// render the scene
renderer.render(scene, camera);
//console.log(t);

}
// update controls
controls.update;

animate();
