import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '@auth/interfaces/user.interface';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';

const baseUrl = environment.baseUrl;

interface ProductOptions {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient);

  private productsCache = new Map<string, ProductsResponse>();
  private singleProductCache = new Map<string, Product>();


  getProducts(options: ProductOptions): Observable<ProductsResponse> {

    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    })
      .pipe(
        tap((resp) => console.log({resp})),
        tap((resp) => this.productsCache.set(key, resp)),
      );
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {

    if (this.singleProductCache.has(idSlug)) {
      return of(this.singleProductCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`).pipe(
      tap( (product) => console.log({product})),
      tap( (product) => this.singleProductCache.set(idSlug, product))
    );
  }

  getProductById(id: string): Observable<Product> {

    if (id === 'new'){
      return of(emptyProduct);
    }

    if (this.singleProductCache.has(id)) {
      return of(this.singleProductCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`).pipe(
      tap( (product) => console.log({product})),
      tap( (product) => this.singleProductCache.set(id, product))
    );
  }

  updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike).pipe(
      tap( (product) => this.updateProductCache(product))
    );
  }

  updateProductCache(product: Product) {
    const productId = product.id;
    this.singleProductCache.set(productId, product);

    this.productsCache.forEach( productResponse => {
      productResponse.products = productResponse.products.map(
        (currentProduct) => {
          return currentProduct.id === productId ? product : currentProduct;
        }
      );
    })
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike).pipe(
      tap( (product) =>  this.singleProductCache.set(product.id, product))
    );
  }

}
