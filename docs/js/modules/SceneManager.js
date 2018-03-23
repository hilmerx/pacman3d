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
        this.walls = []
        this.score = 0

        this.boardContainer = new THREE.Object3D()
        this.boardContainer.position.set(-200,-200,0)
        this.scene.add(this.boardContainer)

        this.renderer.setClearColor(0xeefff999)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight-5)

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

    addGrid(grid, name){
        let buffer = {
            [name]: new THREE.Object3D(),
        }
        buffer[name].name = name

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                buffer[name].add(grid[i][j].mesh.mesh)
            }
        }


        this.boardContainer.add(buffer[name])
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

        if (entity.type === 'wall') {
            this.walls.push(entity)
        }

        this.entities.push(entity)
    }

    addEntitytoMesh(entity){
        this.boardContainer.add(entity.mesh)
    }

    update(){
        // this.controls.update()
        this.updateEntities()

        this.tail.update(this)

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

        this.showScore()
        this.renderer.render(this.scene, this.camera)
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
                this.tail.grid[i][j].mesh.mesh.material.opacity = 0.2
                this.tail.grid[i][j].mesh.mesh.material.color.setHex(0xff99ff)
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

    countScore() {
        let score = 0
        let avaliable = 0
        let scoreSpan

        for (var i = 0; i < this.field.grid.length; i++) {
            for (var j = 0; j < this.field.grid[i].length; j++) {
                let current = this.field.grid[i][j]
                if (current.on && !current.onPermanent) {
                    score++
                }
                if (!current.onPermanent) {
                    avaliable++
                }
            }
        }
        this.score = Math.floor(((score / avaliable)*100)/80*100)
        if (this.score > 100) {
            this.score = 100
        } 

        scoreSpan = document.getElementById('score')
        scoreSpan.textContent = this.score

    }

    showScore(){
    }
}

