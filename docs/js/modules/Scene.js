import SceneManager from './SceneManager.js'
import * as THREE from 'three'
import {Box} from './Structures.js'
import {Pac} from './Pac.js'
import {Bouncer, Eater} from './Enemies.js'
import {Tail} from './Tail.js'
import {Field} from './Field.js'



export function loadScene(){
    //Init scene


    let master = new SceneManager(canvas1)
    master.camera.position.z = 1000
    //Lights
    let light1 = {
        type: new THREE.AmbientLight( 0x888888),
        pos: [50,50,50]
    }
    master.addLight(light1)

    let light2 = {
        type: new THREE.PointLight( 0xffffff, 1, 100 ),
        pos: [50,50,50]
    }
    master.addLight(light2)

    master.field = new Field(master)
    master.addGrid(master.field.grid)

    master.tail = new Tail()
    master.addGrid(master.tail.grid)

    let floor = new Box(new THREE.BoxGeometry( 400,  400, 20 ), new THREE.MeshBasicMaterial( {color: 0x333333} ))
    floor.setPosition(200-10, 200-10, -20)
    master.addEntity(floor)

    let pacman = new Pac()
    pacman.setStartPosition(0, 40)
    pacman.listenTo(window)
    master.addEntity(pacman)

    let green = new Bouncer(master)
    green.setPosition(80, 80, -2)
    master.addEntity(green)

    let red = new Eater()
    red.setPosition(120, 80, 2)
    master.addEntity(red)

    return master
}



