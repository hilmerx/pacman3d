export default class InnerMonster{

  walk(){
    this.location.y -= Math.sin(this.angle)*this.speed
    this.location.x += Math.cos(this.angle)*this.speed
    this.speed = this.origSpeed
  }

  collideWithRoute(){
    if (tail.arr.length > 0){
      for (let i = 0; i<grid.length; i++){
        for (let j = 0; j<grid[i].length; j++){
          if(grid[i][j].tail && this.squareCollide(i,j)){
            tail.waveInit(i,j)
          }
        }
      }
    }
  }

  collideWithPacman(){
    if (dist(pacman.aniX, pacman.aniY, this.location.x, this.location.y)<(pacman.r+this.r) && pacman.flying) {
      die()
    }
  }


  setPostCollSpeedAngle() {
    if (this.collMonster === true) {
      this.speed = this.speedTemp
      this.angle = this.angleTemp
      this.collMonster = false
    }
  }

  collideWithMonster() {
    for (let i = 0; i<monsters.length; i++){
      for (let j = 0; j<monsters[i].length; j++){
        let monster = monsters[i][j]
        if(dist(this.location.x, this.location.y, monster.location.x, monster.location.y)<(this.r+monster.r) && monster.id+1 !== this.id+1){
          let second = monster
          thisSpeedX = Math.cos(this.angle)*this.speed
          thisSpeedY = Math.sin(this.angle)*this.speed
          secondSpeedX = Math.cos(second.angle)*second.speed
          secondSpeedY = Math.sin(second.angle)*second.speed

          collisionPointX = ((this.x * second.r) + (second.x * this.r)) / (this.r + second.r);
          collisionPointY = ((this.y * second.r) + (second.y * this.r)) / (firstBall.r + second.r);

          thisNewX = (thisSpeedX * (this.mass - second.mass) + (2 * second.mass * secondSpeedX)) / (this.mass + second.mass)
          thisNewY = (thisSpeedY * (this.mass - second.mass) + (2 * second.mass * secondSpeedY)) / (this.mass + second.mass)
          secondNewX = (secondSpeedX * (second.mass - this.mass) + (2 * this.mass * thisSpeedX)) / (this.mass + second.mass)
          secondNewY = (secondSpeedY * (second.mass - this.mass) + (2 * this.mass * thisSpeedY)) / (this.mass + second.mass)

          this.collMonster = true
          this.angleTemp = atan2(thisNewY, thisNewX)
          this.speedTemp = dist(0,0,thisNewX,thisNewY)

          return
        }
      }
    }
  }

  bounce(line) {
    let lineSlope = (line.y2-line.y1)/(line.x2-line.x1)
    let linePerpSlope = -1/lineSlope
    let linePerpVector = new p5.Vector(1,linePerpSlope)

    let thisAngleDeg = this.angle* (180 / PI);
    let linePerpRad = Math.atan(linePerpSlope, 1)

    let linePerpDeg = (linePerpRad * (180 / PI) *-1) + 180
    let newAngleDiff = (thisAngleDeg - linePerpDeg)*2
    let newAngle = (thisAngleDeg - newAngleDiff)+180
    let newAngleRad = newAngle * (Math.PI / 180)
    this.angle = newAngleRad
    this.speed = this.speed
  }

  endPointBounce(point) {
    let p = point
    pc = {x: p.x, y: p.y, r: this.r}
    dot = {x: this.location.x, y:this.location.y, angle: this.angle* (180 / PI)}

    diffY = dot.y-pc.y
    diffX = dot.x-pc.x

    angleOfColl = atan2(diffY, diffX)*-1* (180 / PI)

    diffAngle = ((dot.angle-180) - angleOfColl)*2
    newAngleinRad = (dot.angle-180 - diffAngle)* (PI / 180)

    this.angle = newAngleinRad
    this.speed = this.speed
  }

  squareCollide(i,j){

    let distX = Math.abs(this.location.x - grid[i][j].x-w/2)
    let distY = Math.abs(this.location.y - grid[i][j].y-w/2)

    if (distX > (w/2 + this.r)) { return false }
    if (distY > (w/2 + this.r)) { return false }

    if (distX <= (w/2)) { return true; }
    if (distY <= (w/2)) { return true; }

    let dx=distX-w/2;
    let dy=distY-w/2;

    return (dx*dx+dy*dy<=(this.r*this.r));
  }


  lineEndCollideCheck(obj) {

    let point
    let lines
    let endPointCollides

    lines = allLines
    for (let i = 0; i < lines.length; i++){
      let l = lines[i]

      if (dist(l.x1,l.y1, this.location.x,this.location.y) < dist(l.x2,l.y2, this.location.x,this.location.y)){
        point = {x:l.x1, y: l.y1}
      } else {
        point = {x:l.x2, y: l.y2}
      }

      endPointCollides = dist(this.location.x, this.location.y, point.x, point.y)<this.r

      if (endPointCollides) {
        return point
      } else {
        //DO NOTHING
      }
    }
  }

  lineCollideCheck(obj){
    let lines = allLines
    let lineLength
    let line
    let lineSlope
    let objSlope
    let lineOff
    let objOff
    let newX
    let newY
    let hor
    let v
    let m
    let m2
    let dotProduct1
    let dotProduct2
    let withinBoundries
    let point
    let endPointCollides
    let isOnInfLine
    let linesToReturn =[]

    for (let i = 0; i < lines.length; i++){
      l = lines[i]
      lineLength = dist(l.x1,l.y1,l.x2,l.y2)

      if (l.x1 === l.x2){
        lineSlope = 0
      } else {
        lineSlope = ((l.y2-l.y1)/(l.x2-l.x1))
      }


      if (lineSlope === 0){
        objSlope = 0
      } else {
        objSlope = -1/lineSlope
      }


      lineOff = l.y1-l.x1*lineSlope
      objOff = this.location.y-this.location.x*objSlope

      if (l.x1 == l.x2){
        newX = l.x1
        newY = this.location.y

      } else if (l.y1 == l.y2) {
        newY = l.y1
        newX = this.location.x

      } else {
        newX = (objOff-lineOff) / (lineSlope-objSlope)
        newY = newX*objSlope+objOff
      }

      hor = {x: dist(l.x1, l.y1, l.x2, l.x1), y: 0}
      v = {x: l.x2-l.x1, y: l.y2-l.y1 }
      m = {x: this.location.x-l.x1, y: this.location.y-l.y1}
      m2 = {x: this.location.x-l.x2, y: this.location.y-l.y2}

      dotProduct1 = v.x*m.x+v.y*m.y
      dotProduct2 = v.x*m2.x+v.y*m2.y

      withinBoundries = (dotProduct1>0 && dotProduct2<0)

      isOnInfLine = dist(this.location.x, this.location.y, newX, newY)< this.r

      if (isOnInfLine && withinBoundries){
        linesToReturn.push(l)
      } else{
        //DO NOTHING
      }
    }
    return linesToReturn
  }


}
