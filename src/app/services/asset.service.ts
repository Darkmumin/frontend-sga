import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { Asset } from '../models/Asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  url = `${environment.backendUrl}/api/v1/asset`;
  constructor(private httpClient: HttpClient) { }
    getAssets(page: number = 0, size: number = 20): Observable<Asset[]> {
      return this.httpClient
        .get<any>(`${this.url}?page=${page}&size=${size}`)
        .pipe(
          switchMap((response) => {
            const currentPageData = response.content;
            const totalPages = response.totalPages;
            if (page < totalPages - 1) {
              return this.getAssets(page + 1, size).pipe(
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

    saveAsset(asset: Asset): Observable<any> {
      return this.httpClient.post<any>(this.url, asset);
    }

    deleteAsset(id: number): Observable<any> {
      return this.httpClient.delete<any>(`${this.url}/${id}`);
    }

    updateAsset(asset: Asset): Observable<any> {
      return this.httpClient.put<any>(this.url, asset);
    } 
}
