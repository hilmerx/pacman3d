import * as THREE from 'three'
THREE.OrbitControls = require('three-orbit-controls')(THREE)

export default class SceneManager {
    constructor(){

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 3000)

        // this.controls = new THREE.OrbitControls( this.camera )
        this.renderer = new THREE.WebGLRenderer({canvas: canvas1, anitalias: true})
        this.entities = []
        this.lights = []

        this.boardContainer = new THREE.Object3D()
        this.boardContainer.position.set(-200,-200,0)
        this.scene.add(this.boardContainer)

        this.renderer.setClearColor(0xeefff999)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.update()
    }

    updateEntities(){
        let scene = this.scene
        this.entities.forEach(entity => {
            entity.update(scene)
        })
    }

    addLight(newLight){

        let light = newLight.type
        light.position.set(...newLight.pos)
        this.scene.add(light)
    }

    addEntity(entity){
        this.boardContainer.add(entity.mesh)
        this.entities.push(entity)
    }

    update(){
        // this.controls.update()
        this.updateEntities()
        this.renderer.render(this.scene, this.camera)
    }
}

