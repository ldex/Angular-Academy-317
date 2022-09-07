import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, delay, shareReplay, tap, map } from 'rxjs';
import { Product } from '../products/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'https://storerestservice.azurewebsites.net/api/products/';

  products$: Observable<Product[]>;

  constructor(
    private http: HttpClient
  ) {
    this.initProducts();
  }

  insertProduct(newProduct: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, newProduct);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);
  }

  getProductById(id: number): Observable<Product> {
    return this
            .products$
            .pipe(
              map(products => products.find(product => product.id === id))
            )
  }

  initProducts() {
    let url:string = this.baseUrl + '?$orderby=ModifiedDate%20desc';

    this.products$ = this
                      .http
                      .get<Product[]>(url)
                      .pipe(
                        delay(1500), // Fake delay, just to see the loading text!
                        tap(console.table),
                        shareReplay()
                      );
  }
}