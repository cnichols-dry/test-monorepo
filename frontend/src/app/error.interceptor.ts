import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error/error.component';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private dialog:MatDialog){}

  intercept(req:HttpRequest<any>,next:HttpHandler){
    return next.handle(req).pipe(
      catchError((error:HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';
        if(error.error.message){
          errorMessage = error.error.message;
        }

        this.dialog.open(ErrorComponent, {data:{message:errorMessage}});
        return throwError(error);
      })
    );
  }
}