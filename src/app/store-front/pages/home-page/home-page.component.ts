import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router';

import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductsService } from '@products/services/products.service';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productsService = inject(ProductsService);

  activatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map( (params) => (params.get('page') ? +params.get('page')! : 1 )),
      map( page => (isNaN(page) ? 1 : page) )
    ),
    {
      initialValue: 1,
    }
  );

  productResource = rxResource({
    request: () => ({ page: this.currentPage() - 1 }),
    loader: ({request}) => {
      return this.productsService.getProducts({limit: 9, offset: request.page * 9});
    }
  });

}
