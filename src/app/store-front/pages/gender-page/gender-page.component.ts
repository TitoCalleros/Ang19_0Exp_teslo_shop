import { Component, inject } from '@angular/core';
import { I18nSelectPipe } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, I18nSelectPipe, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  paginationService = inject(PaginationService);

  gender = toSignal(
    this.route.params.pipe(
      // se obtiene el gender, que es el nombre definido en la ruta
      map(({gender}) => gender))
    );

  genderMap = {
    kid: "para niños",
    men: "para hombres",
    unisex: "unisex",
    women: "para mujeres",
  };


  productResource = rxResource({

    request: () => ({gender: this.gender(), page: this.paginationService.currentPage() - 1}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        limit: 9,
        offset: request.page * 9,
        gender: request.gender,
      });
    }
  });


}
