import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ProductsService } from './products.service';
import { NavComponent } from './nav/nav.component';
import { ProductComponent } from './product/product.component';
import { LoginComponent } from './login/login.component';
import { Ng2DragDropModule } from 'ng2-drag-drop';

const ROUTES = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'products',
    component: ProductComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ProductComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    Ng2DragDropModule.forRoot()
  ],
  providers: [ProductsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
