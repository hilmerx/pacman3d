import * as THREE from 'three'

export class Green {
    constructor(geometry, material){
        this.geometry = new THREE.SphereGeometry( 8, 32, 32 )
        this.material = new THREE.MeshBasicMaterial( {color: 0x22ff00} )
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

export class Red {
    constructor(geometry, material){
        this.geometry = new THREE.SphereGeometry( 12, 32, 32 )
        this.material = new THREE.MeshBasicMaterial( {color: 0xff0000} )
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

