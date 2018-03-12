export function dist(x1, y1, x2, y2){
    return Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2))
}

export class Vec3 {
    constructor(x, y, z){
        this.x = x
        this.y = y
        this.z = z

        // this.set(0, 0, 0)
    }

    set(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
}

export class Vec2 {
    constructor(x, y){
        this.x = x
        this.y = y

    }

    set(x, y) {
        this.x = x
        this.y = y
    }
}

export function new2DArray(rows, cols){
    let arr = new Array(rows)
    for (let i = 0; i<arr.length; i++){
        arr[i] = new Array(cols)
        for (let j = 0; j<arr[i].length; j++){
            arr[i][j] = 0
        }
    }
    return arr
}