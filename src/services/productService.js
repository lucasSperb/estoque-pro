import { productsData } from
"../features/produtos/mocks/productsData";

const delay=(ms)=>
new Promise(resolve=>setTimeout(resolve,ms));

const productService={

async getAll(){

await delay(300);

return [...productsData];

},

async create(product){

await delay(300);

return{

id:Date.now(),

...product

};

},

async update(product){

await delay(300);

return product;

},

async remove(id){

await delay(300);

return id;

}

};

export default productService;