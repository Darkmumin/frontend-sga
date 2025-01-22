import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = `${environment.backendUrl}/api/v1/category`;
  constructor(private httpClient: HttpClient) { }

  getCategories(): Observable<any> {
    return this.httpClient.get<any>(this.url);
  }

  saveCategory(category: Category): Observable<any> {
    return this.httpClient.post<any>(this.url, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/${id}`);
  }

  updateCategory(category: Category): Observable<any> {
    return this.httpClient.put<any>(this.url, category);
  }
}
