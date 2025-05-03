import { Component, inject, input, OnInit } from '@angular/core';
import { Product, Size } from '@products/interfaces/product.interface';
import { ProductCarrouselComponent } from "@products/components/product-carrousel/product-carrousel.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'product-details',
  imports: [ProductCarrouselComponent, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();

  fb = inject(FormBuilder);

  productDetailsForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10)]],
    description: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0,  [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());

  }

  setFormValue(formLike: Partial<Product>) {
    this.productDetailsForm.reset(formLike as any);
    this.productDetailsForm.patchValue({tags: formLike.tags?.join(',')});
  }

  onSubmit() {
    console.log(this.productDetailsForm.value);

  }
 }
