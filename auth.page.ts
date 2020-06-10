import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {}


  authenticate(email: String, password: String){
    this.isLoading = true;
    this.loadingCtrl
    .create({keyboardClose: true, message: 'Logging in..'})
    .then( loadingEl => {
      loadingEl.present();
      this.authService.login(email, password).subscribe(
        resData => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/admin-page');
        },
        errRes => {
          loadingEl.dismiss();
          const code = errRes.error.error.message;
          let message = 'Email Id or Password is Incorrect';
          if (code ==='INVALID_EMAIL'){
            message = 'Email ID is not found !';
          }
          else if(code === 'INVALID_PASSWORD'){
            message = 'Password Incorrect !';
          }
          else{
            message = message;
          }
          this.showAlert(message);

        }
      )
    })
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const emailId = form.value.emailId;
    const password = form.value.password;
    this.authenticate(emailId, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
