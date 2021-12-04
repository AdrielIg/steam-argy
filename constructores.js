export class Producto {
    constructor(name,price,img){
        this.name = name;
        this.price = price;
        this.img = img

    }
    getName(){
        return this.name
    }
    getPrice(){
        return this.price
    }
    getImg(){
        return this.img
    }

    mostrarItem(){
        console.log(`Nombre: ${this.name} - Price: ${this.price}`)
    }
}

 export class ListaProductos{
    constructor(items = []){
        this.array = items
    }
    mostrarItems(){
        console.log(this.array)
    }
    getItemByChoice(i){
        return this.array[i - 1]
    }
}

