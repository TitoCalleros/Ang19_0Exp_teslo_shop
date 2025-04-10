import { SlicePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '@products/interfaces/product.interface';
import { ProductsService } from '@products/services/products.service';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  productsService = inject(ProductsService);

  product = input.required<Product>();

  imageUrl = computed(() => {
    return `${baseUrl}/files/product/${this.product().images[0]}`;
  });


}
