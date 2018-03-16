import * as THREE from 'three'
THREE.OrbitControls = require('three-orbit-controls')(THREE)

export default class SceneManager {
    constructor(){

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/(window.innerHeight-5   ), 0.1, 3000)

        this.controls = new THREE.OrbitControls( this.camera )
        this.controls.enableKeys = false

        this.renderer = new THREE.WebGLRenderer({canvas: canvas1, anitalias: true})
        this.entities = []
        this.lights = []
        this.field
        this.tail
        this.enemies = []
        this.pacman = []

        this.boardContainer = new THREE.Object3D()
        this.boardContainer.position.set(-200,-200,0)
        this.scene.add(this.boardContainer)

        this.renderer.setClearColor(0xeefff999)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight-5)

        this.update()
    }

    updateEntities(){
        this.entities.forEach(entity => {
            entity.update(this, this.tail)
        })
    }

    addLight(newLight){

        let light = newLight.type
        light.position.set(...newLight.pos)
        this.scene.add(light)
    }

    addGrid(grid){
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                this.addEntity(grid[i][j].mesh)
            }
        }
    }

    addEntity(entity){
        if (entity.mesh){
            this.addEntitytoMesh(entity)
        }
        if (entity.type === 'bouncer' || entity.type === 'eater') {
            this.enemies.push(entity)
        }

        if (entity.type === 'pacman') {
            this.pacman.push(entity)
        }

        this.entities.push(entity)
    }

    addEntitytoMesh(entity){
        this.boardContainer.add(entity.mesh)
    }

    update(){
        // this.controls.update()
        this.updateEntities()
        this.renderer.render(this.scene, this.camera)
        let enemies = this.enemies
        let currentEnemy
        for (let i = 0; i<enemies.length; i++){
            currentEnemy = enemies[i]
            currentEnemy.collideWithMonster(enemies)
        }

        for (let i = 0; i<enemies.length; i++){
            currentEnemy = enemies[i]
            currentEnemy.setPostCollSpeedAngle(enemies)
        }

    }

    die(){
        let grid = this.field.grid
        this.field.getFlood = []
        this.field.floodArr = []
        this.pacman[0].setPosition(0, 0, 20)
        this.pacman[0].x = 0
        this.pacman[0].y = 0

        this.pacman[0].prevX = 0
        this.pacman[0].prevY = 0
        // tail.waveInitArr = []

        this.tail.arr = []
        this.pacman[0].direction = ''

        for (let i = 0; i<grid.length; i++){
            for (let j = 0; j<grid[i].length; j++){
                this.tail.grid[i][j].mesh.mesh.visible = false
                grid[i][j].activeLines = []

                if (i === 0 || j === 0 || i === grid.length-1 || j === grid[i].length-1) {
                    grid[i][j].mesh.mesh.visible = true
                    grid[i][j].on = true
                } else {
                    grid[i][j].on = false

                    grid[i][j].mesh.mesh.visible = false
                }
            }
        }


    }
}

