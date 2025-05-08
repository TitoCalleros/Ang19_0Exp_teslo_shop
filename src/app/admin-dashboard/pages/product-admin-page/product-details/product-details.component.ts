import { Router } from '@angular/router';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ProductsService } from '@products/services/products.service';

import { Product } from '@products/interfaces/product.interface';
import { ProductCarrouselComponent } from "@products/components/product-carrousel/product-carrousel.component";
import { FormErrorLabelComponent } from "@products/components/form-error-label/form-error-label.component";
import { FormUtils } from '@shared/utils/form-utils';

@Component({
  selector: 'product-details',
  imports: [ProductCarrouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {

  product = input.required<Product>();

  fb = inject(FormBuilder);
  router = inject(Router);

  productService = inject(ProductsService);

  formUtils = FormUtils;

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

  onSizeClick(size: string) {

    const currentSizes = this.productDetailsForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    console.log(currentSizes);


    this.productDetailsForm.patchValue({ sizes: currentSizes });
  }

  onSubmit() {
    const isValid = this.productDetailsForm.valid;

    this.productDetailsForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productDetailsForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',').map( tag => tag.trim()) ?? []
    };

    if (this.product().id === 'new') {
      this.productService.createProduct(productLike).subscribe(
        product => {
          console.log('Producto creado', product);
          this.router.navigate(['admin/product', product.id]);
        }
      );
    } else {
      this.productService.updateProduct(this.product().id, productLike).subscribe(
        product => { console.log('Producto actualizado', product); }
      );
    }

  }
 }
