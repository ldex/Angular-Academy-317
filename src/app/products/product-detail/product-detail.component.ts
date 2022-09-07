import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../product.interface';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  product: Product;
  private subscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) { }

  delete() {
    if(window.confirm('Are you sure ?')) {
      this
      .productService
      .deleteProduct(this.product.id)
      .subscribe({
        next: () => {
          console.log('Product was deleted from the server.');
          this.productService.initProducts(); // Reset local cache
          this.router.navigateByUrl('/products');
        },
        error: err => console.error('Could not delete product: ' + err)
      }
      )
    }
  }

  ngOnInit(): void {
    let id = +this.activatedRoute.snapshot.params.id;

    this.subscription.add(
      this
      .productService
      .getProductById(id)
      .subscribe({
        next: data => this.product = data
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
