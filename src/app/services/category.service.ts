import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = `${environment.backendUrl}/api/v1/category`;
  constructor(private httpClient: HttpClient) { }

    // Fetch all categories by making multiple paginated requests
    getCategories(page: number = 0, size: number = 20): Observable<Category[]> {
      return this.httpClient
        .get<any>(`${this.url}?page=${page}&size=${size}`)
        .pipe(
          switchMap((response) => {
            const currentPageData = response.content;
            const totalPages = response.totalPages;
  
            // If there are more pages, recursively fetch the next page
            if (page < totalPages - 1) {
              return this.getCategories(page + 1, size).pipe(
                map((nextPageData) => [...currentPageData, ...nextPageData])
              );
            } else {
              // If this is the last page, return the current page data
              return of(currentPageData);
            }
          }),
          catchError((error) => {
            console.error('Error fetching categories:', error);
            return of([]); // Return an empty array in case of error
          })
        );
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
