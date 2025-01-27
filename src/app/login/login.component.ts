import { Component} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../layout/component/app.floatingconfigurator';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ReactiveFormsModule]
})
export class LoginComponent {
    private username: string = '';

    private password: string = '';

    checked: boolean = false;

    token: string = environment.token;

    form: FormGroup;

    constructor(
        private _authService: AuthService,
        private _redirectTo: Router
    ) {
        this.form = new FormGroup({
            username: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            rememberMe: new FormControl(false)
        });
    }

    accept() {
        this.username = this.form.get('username')?.value;
        this.password = this.form.get('password')?.value;
        this.checked = this.form.get('rememberMe')?.value;
        this._authService.login(this.username, this.password).subscribe(
            (data) => {
                if (data) {
                    const tokenString = JSON.stringify(data);
                    const token = JSON.parse(tokenString).token;
                    sessionStorage.setItem(this.token, token);
                    this._redirectTo.navigateByUrl('/');
                }
            },
            (error) => {
                if (error.status === 400) {
                    alert('User and/or password incorrect');
                }
                if (error.status === 500) {
                    alert('Server error');
                }
                if (error.status === 0) {
                    alert('Conexion error');
                }
                if (this.checked) {
                    sessionStorage.setItem(this.token, this.token);
                }
            }
        );
    }
}
