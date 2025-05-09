import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;
const placeholder = './assets/images/no-image.jpg';

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[] | null): string {

    if (!value) return placeholder;

    if (typeof value === 'string') {
      return `${baseUrl}/files/product/${value}`;
    }

    const image = value.at(0);

    if (!image) return placeholder;

    return `${baseUrl}/files/product/${image}`;
  }
}
