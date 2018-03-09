import * as THREE from 'three'

export class Box {
    constructor(geometry, material){
        this.geometry = geometry
        this.material = material
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.traits = []
        this.pos = this.mesh.position
        this.ID = this.mesh.uuid
        this.visible = this.mesh.visible
        this.solid = false 
    }

    addTrait(trait) {
        this.traits.push(trait)
    }

    setPosition(x, y = 0, z) {
        this.mesh.position.set(x, y, z)
    }

    update(scene){
        this.traits.forEach(trait => {
            trait(this.mesh)
        })
        this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z)
    }
}

