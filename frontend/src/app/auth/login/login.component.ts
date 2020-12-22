import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  private authStatusSub:Subscription;
  
  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus =>{
      this.isLoading = false;
    })
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
       return; 
    }
    this.isLoading = true;
    this.authService.login(form.value.email,form.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
