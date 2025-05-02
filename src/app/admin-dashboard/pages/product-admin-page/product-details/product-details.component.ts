import { Component, input } from '@angular/core';
import { Product, Size } from '@products/interfaces/product.interface';
import { ProductCarrouselComponent } from "@products/components/product-carrousel/product-carrousel.component";

@Component({
  selector: 'product-details',
  imports: [ProductCarrouselComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent {
  product = input.required<Product>();
  sizes = input<Size[]>();
 }
