import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ProductTableComponent } from "@products/components/product-table/product-table.component";
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productsService = inject(ProductsService);

  paginationService = inject(PaginationService);

  productsPerPage = signal(9);

  productResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1, productLimit: this.productsPerPage() }),
    loader: ({request}) => {

      console.log(request.productLimit);

      return this.productsService.getProducts({limit: request.productLimit, offset: request.page * request.productLimit});
    }
  });
}


