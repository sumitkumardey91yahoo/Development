class Father {
  constructor() {
    console.log("i am Father");
  }
}

class Mother {
  constructor() {
    console.log(" i am Mother");
  }
}
class  Child extends Father {
  constructor() {
    super();
    console.log("i am child");
  }
  ok() {
    console.log("i am okay");
  }
}

console.log(new Child());

// new Child().ok();

// console.clear()

// class swim {
//  setSwimProperties(speed, direction) {
//    this.speed = speed;
//    this.direction = direction;
//  }
//
//  getSwimProperties(){
//    console.log(`swimming ${this.speed} towards ${this.direction}`);
//  }
// }
//
// class Reptile {
//  constructor(name) {
//    this.name = name;
//  }
// }
//
// Object.assign(Reptile.prototype, swim.prototype);
// let alligator = new Reptile("alligator");
// alligator.setSwimProperties("5 m/s", "upstream");
// alligator.getSwimProperties();
