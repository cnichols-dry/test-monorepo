import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookListComponent } from './books/book-list/book-list.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { AuthGuard } from './auth/auth.guard';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { CartComponent } from './cart/cart.component';


const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'home',component:BookListComponent},
  {path:'addbook',component:BookCreateComponent,canActivate:[AuthGuard]},
  {path:'edit/:bookId',component:BookCreateComponent,canActivate:[AuthGuard]},
  {path:'details/:bookId',component:BookDetailsComponent,canActivate:[AuthGuard]},
  {
    path:'auth',
    loadChildren: ()=> import('./auth/auth.module').then(a => a.AuthModule)
  },
  {
    path:'cart',component:CartComponent,canActivate:[AuthGuard],
  },
  {path:'**',redirectTo:'/auth/login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
