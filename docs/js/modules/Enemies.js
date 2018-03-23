import * as THREE from 'three'
import InnerMonster from './InnerMonster'
import {Vec3} from './Math'



export class Bouncer extends InnerMonster{
    constructor(x, y) {
        super()
        this.r = 10
        this.position = new Vec3(x, y, -2)
        this.type = 'bouncer'
        this.d = 16
        this.mass = 10
        this.angleArr = [-90, -180]
        this.angleArr = [0, -180]
        // this.angle = (180 - 45) * Math.random(1) * (Math.PI / 180);
        this.angle = 360 *Math.random(1)* (Math.PI / 180);
        // this.angle = 90 * (Math.PI / 180);

        this.origSpeed = 2
        this.speed = this.origSpeed
        this.speedTemp = this.speed
        this.angleTemp = this.angle

        this.geometry = new THREE.SphereGeometry( 8, 32, 32 )
        this.material = new THREE.MeshBasicMaterial( {color: 0x22ff00} )
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.ID = this.mesh.uuid
        this.setPosition(this.position.x, this.position.y, this.position.z)
    }

    setPosition(x, y , z = -2) {
        this.mesh.position.set(x, y, z)
    }

    setStartPosition(x, y, z = -2) {
        this.position.x = x + 10
        this.position.y = y + 10
    }

    update(master) {
        this.collideWithTail(master)
        this.collideWithBorder(master.field.consolidatedLines)
        this.walk()
        this.setPosition(this.position.x-10, this.position.y-10, this.position.z)
        this.collideWithPacman(master)
    }


    collideWithBorder(lines){
        let collidingLines = this.lineCollideCheck(lines)
        let collidingLineEnd = this.lineEndCollideCheck(lines)
        this.type = 'eater'

        if (collidingLines.length > 0) {
            collidingLines.forEach((line) => {
                this.bounce(line)
            })
            return
        } else if (collidingLineEnd) {
            this.endPointBounce(collidingLineEnd)
        } else {
            //DO NOTHING
        }
    }
}


export class Eater extends InnerMonster{
    constructor() {
        super()

        this.position = new Vec3(80, 150, -2)
        this.type = 'eater'

        this.d = 16
        this.r = 10
        this.mass = 10
        this.angleArr = [-90, -180]
        this.angleArr = [0, -180]
        this.angle = 360 *Math.random(1)* (Math.PI / 180);
        // this.angle = 271+180 * (Math.PI / 180);

        this.origSpeed = 1.5
        this.speed = this.origSpeed
        this.speedTemp = this.speed
        this.angleTemp = this.angle

        this.geometry = new THREE.SphereGeometry( 8, 32, 32 )
        this.material = new THREE.MeshBasicMaterial( {color: 0xff0000} )
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.ID = this.mesh.uuid

        // this.setPosition(this.position.x-10, this.position.y-10, this.position.z)

    }

    setPosition(x, y = 0, z) {
        this.mesh.position.set(x, y, z)
    }

    setStartPosition(x, y, z = 2) {
        this.position.x = x + 10
        this.position.y = y + 10
    }


    update(master) {
        this.collideWithTail(master)
        this.collideWithBorder(master.field.consolidatedLines, master)
        // if (gameActive) {
        this.walk()
        this.setPosition(this.position.x-10, this.position.y-10, this.position.z)
        this.collideWithPacman(master)
    }

    collideWithBorder(lines, master){
        let collidingLines = this.lineCollideCheck(lines)
        let collidingLineEnd = this.lineEndCollideCheck(lines)
        if (collidingLines.length > 0) {
            collidingLines.forEach((line) => {
                this.bounce(line)
                this.eatCell(master)
            })
            return
        } else if (collidingLineEnd) {
            this.endPointBounce(collidingLineEnd)
            this.eatCell(master)
        } else {
            //DO NOTHING
        }
    }


    eatCell(master){
        let grid = master.field.grid

        let pacman = master.pacman[0]
        let field = master.field
        for (let i = 0; i<grid.length; i++){
            for (let j = 0; j<grid[i].length; j++){
                if(this.squareCollide(i, j, grid) && grid[i][j].onPermanent === false && grid[i][j].on) {
                    grid[i][j].on = false
                    grid[i][j].mesh.mesh.visible = false
                    grid[i][j].activeLines = []
                    master.countScore()
                    field.initLineChecks(master)
                    if (grid[i][j].x2 - 10 === pacman.mesh.position.x && grid[i][j].y2 - 10 === pacman.mesh.position.y) {
                        pacman.direction = pacman.lastDirection
                        pacman.flying = true
                    }
                }
            }
        }
    }
}
