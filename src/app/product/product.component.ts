import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: any = [];

  items: any = [];

  droppedItems: any = [];

  selectedProduct = {};

  productQuery = "";

  saved = false;

  error= false;

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
      this.productsService.getAllProducts().subscribe(products => {
        this.products = products;
      });

      this._updateCategories();
      this.newProduct();
  }

  _updateCategories() {
    this.productsService.getAllCategories().subscribe(categories => {
      this.items = categories;
    });
  }

  public selectProduct(productId) {
    this.saved = false;
    this.error = false;
    this.productsService.getProductById(productId).subscribe(product => {
       this.selectedProduct = product;
    });
  }

  public onItemDrop(event) {
    this.saved = false;
    this.error = false;
    var alreadyAdded = false;
    for(let item of this.droppedItems) {
      if(item == event.dragData) {
        alreadyAdded = true;
        break;
      }
    }
    if(!alreadyAdded) {
      this.droppedItems.push(event.dragData);
      this.searchProducts();
    }
  }

  public removeItem(removedItem) {
    this.saved = false;
    this.error = false;
    var updatedItems = [];
    for(let item of this.droppedItems) {
      if(item != removedItem) {
        updatedItems.push(item);
      }
    }
    this.droppedItems = updatedItems;
    this.searchProducts();
  }

  public deleteProduct(productId) {
    this.saved = false;
    this.error = false;
    this.productsService.deleteProductById(productId).subscribe(res => {
         this.products = res;
         this.newProduct();
         this._searchProducts();
         this._updateCategories();
      });
  }

  public saveProduct() {
    this.saved = false;
    this.error =  ((this.selectedProduct['title'] == null || this.selectedProduct['title'] == "") ||
                   (this.selectedProduct['category'] == null || this.selectedProduct['category'] == "") ||
                   (this.selectedProduct['price'] == null || this.selectedProduct['price'] == ""));
    console.log("Selected Product: ", this.selectedProduct);
    console.log("this.error: ", this.error);
    console.log("this.saved: ", this.saved);
    if(!this.error) {
      this.productsService.saveProduct(this.selectedProduct).subscribe(res => {
         this.products = res;
         this.saved = true;
         this.newProduct();
         this._searchProducts();
         this._updateCategories();
      });
    }
  }

  public newProduct() {
    this.selectedProduct = {};
  }

  public searchProducts() {
    this.saved = false;
    this.error = false;
    this._searchProducts();
  }

  public _searchProducts() {
    this.productsService.searchProducts(this.productQuery, this.droppedItems).subscribe(res => {
       this.products = res;
    });
  }

  public readURL(prodId) {
      var inFileObj = document.getElementById('imgUpl-' + prodId);
      if (inFileObj["files"] && inFileObj["files"][0]) {
          var reader = new FileReader();
          var imgObj = document.getElementById('img-' + prodId);
          reader.onload = function (e) {
              console.log("Image Loaded");
              imgObj["src"] = e.target["result"];
          };
          reader.readAsDataURL(inFileObj["files"][0]);
      }
  }

  public uploadFile(prodId) {
        var inFileObj = document.getElementById('imgUpl-' + prodId);
        if (inFileObj["files"] && inFileObj["files"][0]) {
            var uploadUrl = "/api/upload-file";
            var fd = new FormData();
            fd.append('file', inFileObj["files"][0]);
            this.productsService.uploadFile(prodId, fd).subscribe(res => {
              console.log('uploaded: ', res);
           });
        }
    }

}
