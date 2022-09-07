import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../product.interface';

interface ProductForm {
  name: FormControl<string>;
  price: FormControl<number>;
  description: FormControl<string>;
  imageUrl: FormControl<string>;
  discontinued: FormControl<boolean>;
  fixedPrice: FormControl<boolean>;
  modifiedDate: FormControl<Date>;
}

@Component({
  selector: 'app-product-insert',
  templateUrl: './product-insert.component.html',
  styleUrls: ['./product-insert.component.css']
})
export class ProductInsertComponent implements OnInit {

  insertForm: FormGroup<ProductForm>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) { }

  onSubmit() {
    let newProduct: Product = this.insertForm.getRawValue();
    this
      .productService
      .insertProduct(newProduct)
      .subscribe({
        next: product => {
          console.log('New product created on the server with id: ' + product.id);
          this.productService.initProducts();
          this.router.navigateByUrl('/products');
        },
        error: err => console.error('Could not save product' + err)
      }
      )

  }

  ngOnInit() {
    let validImgUrlRegex: string = '^(https?\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,5}(?:\/\S*)?(?:[-A-Za-z0-9+&@#/%?=~_|!:,.;])+\.(?:jpg|jpeg|gif|png))$';

    this.insertForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.maxLength(50)]],
        price: [null as number, [Validators.required, Validators.min(0), Validators.max(10000000)]],
        description: ['', [Validators.minLength(5), Validators.maxLength(100)]],
        imageUrl: ['', [Validators.pattern(validImgUrlRegex)]],
        discontinued: [false],
        fixedPrice: [false],
        modifiedDate: [null]
      }
    );
  }

  get name() { return this.insertForm.get('name'); }
  get price() { return this.insertForm.get('price'); }
  get description() { return this.insertForm.get('description'); }
  get imageUrl() { return this.insertForm.get('imageUrl'); }

}
