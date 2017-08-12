import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductsService {

 constructor(private http: Http) { }

   // Get all products from the API
   getAllProducts() {
     return this.http.get('/api/products')
       .map(res => res.json());
   }

   getAllCategories() {
     return this.http.get('/api/categories')
       .map(res => res.json());
   }

   getProductById(prodId)  {
     return this.http.get('/api/product/' + prodId)
       .map(res => res.json());
   }

   saveProduct(product) {
      return this.http.post('/api/save-product', product)
        .map(res => res.json());
   }

   deleteProductById(prodId) {
     return this.http.get('/api/delete-product/' + prodId)
       .map(res => res.json());
   }

   searchProducts(title, categories) {
     var prodQuery = {'text': title, 'categories': categories};
     return this.http.post('/api/search', prodQuery)
       .map(res => res.json());
   }

   uploadFile(id, fd) {
     return this.http.post('/api/upload-file/' + id, fd)
       .map(res => res.json());
   }

}
