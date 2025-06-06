import { AfterViewInit, Component, effect, ElementRef, input, OnChanges, SimpleChanges, viewChild } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-carrousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carrousel.component.html',
  styles: `
    .swiper {
      width: 100%;
      height: 500px;
    }
  `
})
export class ProductCarrouselComponent implements AfterViewInit, OnChanges {
  swiperDiv = viewChild.required<ElementRef>('swiperDiv');

  images = input.required<string[]>();

  ngAfterViewInit(): void {
    this.swiperInit();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['images'].firstChange) {
      return;
    }

    this.swiperInit();
  }

  swiperInit() {
    const element = this.swiperDiv().nativeElement;

    if (!element) return;

    const swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      modules: [Navigation, Pagination],

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

}
