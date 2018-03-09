import SceneManager from './SceneManager.js'
import * as THREE from 'three'
import {Box} from './Structures.js'
import {Pac} from './Pac.js'
import {Green} from './Enemies.js'
import {Red} from './Enemies.js'



export function loadScene(verts){
    //Init scene


    let master = new SceneManager(canvas1)
    master.camera.position.z = 1500



    // var axesHelper = new THREE.AxesHelper( 5 )
    // master.scene.add( axesHelper )


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

    let grid = new2DArray(20, 20)

    grid = loadBoxes(grid, master)

    let floor = new Box(new THREE.BoxGeometry( 400,  400, 20 ), new THREE.MeshBasicMaterial( {color: 0x333333} ))
    floor.setPosition(200-10, 200-10, -20)
    master.addEntity(floor)

    let pacman = new Pac(grid)
    pacman.setPosition(0, 0, 20)
    pacman.listenTo(window)
    master.addEntity(pacman)

    let green = new Green()
    green.setPosition(80, 80, -2)
    master.addEntity(green)

    let red = new Red()
    red.setPosition(120, 80, 2)
    master.addEntity(red)

    window.grid = grid
    return master
}



function new2DArray(rows, cols){
    let arr = new Array(rows)
    for (let i = 0; i<arr.length; i++){
        arr[i] = new Array(cols)
        for (let j = 0; j<arr[i].length; j++){
            arr[i][j] = 0
        }
    }
    return arr
}

function loadBoxes(grid, scene){
    for (let i = 0; i<grid.length; i++){
        for (let j = 0; j<grid[i].length; j++){
            let size = 20
            let geometry = new THREE.BoxGeometry( size,  size, size )
            let material = new THREE.MeshBasicMaterial( {color: 0x0000ff} )

            let entity = new Box(geometry, material)

            entity.setPosition(i * size, j * size, 0)

            if (i === 0 || j === 0 || i === grid.length-1 || j === grid[i].length-1) {
                entity.mesh.visible = true
                entity.solid = true
            } else {
                entity.mesh.visible = false
            }
            grid[i][j] = entity
            scene.addEntity(grid[i][j])
        }
    }

    return grid
}

