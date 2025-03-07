# Imma make a Particle System
## For Three.js, in js.
## It will be God's shittiest Particle System
## 2025.03.05 Chance Hoard

#### Obviously, this readme overview is inaccurate to what the Particle System currently is, that is because the Particle System is still in development! There currently are no subclasses, so the `ParticleSystem` class is used as a standalone and not a parent. This will change but it is spring break.
#### The Particle System can currently only support sphere geometry, so the sphere parameters are inside of the `ParticleSystem` constructor. This creates sphere `Particles`.
#### Only the overview is inaccurate it's kinda the end goal. Everything else is up to speed.
---
---
---
# OVERVIEW:
### The Particle System has a `ParticleSystem` class that has subclasses `SphereParticleSystem`, `CubeParticleSystem`, `CircleParticleSystem`, and `MeshParticleSystem`. It also contains a `Particle` class that is a container for Three.js' `Object3D`.
### To use the particle system, create a custom Object with one of the Particle System's subclasses and satisfy the parameters. Calling `Start()` starts the Particle System and fires your emission! Call `Update()` once per whenever you wish to animate the particle system, it's like a tick.
---
---
---
# CUSTOM CLASSES
---
---
---
# CLASS 1: ParticleSystem
### The object the programmer will create to use the particle system.
---
---
# Variables and Attributes
---
## Parameters:
#### `Amount (int)` - Controls the amount of particles that spawn per wave.
#### `Radius (float)` - Radius of the sphreical particles
#### `widthSegments (int)` - Number of segments to make up the width of the particle (more segments means higher def spheres.)
#### `heightSegments (int)` - Number of segments to make up the height of the particle (more segments means higher def spheres.)
#### `shape (String)` - Shape of the emission. Orb, Cone, or Flat.
#### `direction (int[3])` - Direction the particles will travel (X, Y, Z)
#### `force (float)` - Force on the particles in the system.
#### `duration (int)` - Number of frames the particles will live.
#### `colors (0x000000[])` - Colors of the projectiles.
#### `spawnDelay (int)` - Time delay between waves, if looping is false this will not matter.
#### `Gradiant (boolean)` - If `false`, the particles will assume random colors. If `true`, the colors will dictate a life to death gradiant for the particles.
#### `looping (boolean)` - Dictates if the system will loop.
#### `gravity (boolean)` - Dictates if the system utalizes gravity.
#### `mass (float)` - Mass of the particles, effects force and fallspeed if gravity is enabled.
---
## Defaults Upon Intialization:
#### `particles (Paticle[])` - A collection of all particles inside the scene being emmited from the particle system.
#### `loopTicker (int)` - A timer that continuously counts up and resets when it hits `spawnDelay`. 
---
---
# Methods
---
## Inteded for Implementation
---
### `Start() void` - Call to intialize the Particle System.
1. #### Clears `particles`.
2. #### Resets `loopTicker` to 0.
3. #### Calls `this.spawnParticles()`.
---
### `Update() void` - Call to update and animate the particle system.
1. #### Checks if `loopTicker` has reached `spawnDelay` and calls `this.spawnParticles` accordingly. Increments `loopTicker` and auto resets it.
2. #### Updates particles in `this.particles`.
3. #### Deletes particles in `this.particles` after their `age` surpasses the System `duration`.
4. ####
---
## Discrete Methods inteded for Internal Calls
---
### `spawnParticles() void` - Creates and spawns a wave of particles.
1. #### Determines particle coloring method (Single, Multiple(Random), Multiple(Gradiant)).
2. #### Creates `Particle` objects and adds their `mesh` to the scene.
3. #### Invokes `Particle.addForce(Int[3])` for each particle in the `shape`, `direction`, and `force` of the programmers choosing.
---
---
# CLASS 2: Particle
### A container for Three.js `Object3D`
---
---
# Variables and Attributes
---
## Parameters
### `radius (float)` - The radius of the Three.js sphere.
### `widthSegments (int)` - The `widthSegments` of the sphere.
### `heightSegments (int)` - The `heightSegments` of the sphere.
### `color (0x00000)` - The color of the sphere.
---
## Defaults Upon Initalization
### `geometry (THREE.SphereGeometry)` - Three.js Sphere Geometry.
### `material (THREE.MeshBasicMaterial)` - Three.js Material.
### `mesh (THREE.Mesh)` - Three.js Mesh.
### `velocity (int[3])` - Velocity of the particle.
### `age (int)` - Age counter of the particle.
---
---
# Methods
---
## `update()`