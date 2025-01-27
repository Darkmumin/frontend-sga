import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = `${environment.backendUrl}/api/v1/auth/login`;

  token: string = environment.token;


  constructor(
    private httpClient: HttpClient
  ) { }

  login(username: string, password: string){
    return this.httpClient.post(this.url, {username, password},
      {
        headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
      }
    )};
  logout(){
    sessionStorage.clear();

  }
  getToken(){
    let token = sessionStorage.getItem(this.token);
    if(token === null){
      token = '';
    }
    return token;
  }
}
