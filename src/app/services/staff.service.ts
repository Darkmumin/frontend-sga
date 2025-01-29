import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Staff } from '../models/Staff';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  url = `${environment.backendUrl}/api/v1/staff`

  constructor(private httpClient: HttpClient) { }

    getStaffs(page: number = 0, size: number =20 ): Observable<Staff[]>  {
      return this.httpClient
        .get<any>(`${this.url}?page=${page}&size=${size}`)
        .pipe(
          switchMap((response) => {
            const currentPageData = response.content;
            const totalPages = response.totalPages;
            if (page < totalPages - 1) {
              return this.getStaffs(page + 1, size).pipe(
                map((nextPageData) => [...currentPageData, ...nextPageData])
              );
            } else {
              return of(currentPageData);
            }
          }),
          catchError((error) => {
            console.error('Error fetching assets:', error);
            return of([]);
          })
        );
      }

    deleteStaffs(id:number): Observable<any> {
      return this.httpClient.delete<any>(`${this.url}/${id}`)
    }

    saveStaffs(staff: Staff): Observable<any> {
      return this.httpClient.post<any>(this.url, staff)
    }

    updateStaff(staff: Staff): Observable<any> {
      return this.httpClient.put<any>(this.url, staff)
    }
}
