
class Animal {
    constructor() {
        console.log("Animal")
    }

    leg() {
        console.log("four")
    }
}

class Dog extends Animal {
    constructor() {
        console.log("Dog");
        this.init()
    }

    init(){
        super();
    }
}



new Dog().leg();