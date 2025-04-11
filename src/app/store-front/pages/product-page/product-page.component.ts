import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarrouselComponent } from "../../../products/components/product-carrousel/product-carrousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarrouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {

  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);

  idSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request: () => ({idSlug: this.idSlug}),
    loader: ({request}) => {
      return this.productsService.getProductByIdSlug(request.idSlug);}
  });

}
