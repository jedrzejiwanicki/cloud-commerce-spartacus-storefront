import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  ConfigModule,
  I18nModule,
  UrlModule,
} from '@spartacus/core';
import {
  FormComponentsModule,
  ListNavigationModule,
  MediaModule,
  StarRatingModule,
} from '../../../shared/index';
import { AddToCartModule } from '../../cart/index';
import { IconModule } from '../../misc/icon/index';
import { ProductListComponent } from './container/product-list.component';
import { ProductFacetNavigationComponent } from './product-facet-navigation/product-facet-navigation.component';
import { ProductGridItemComponent } from './product-grid-item/product-grid-item.component';
import { ProductListItemComponent } from './product-list-item/product-list-item.component';
import { ProductViewComponent } from './product-view/product-view.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CMSProductListComponent: { selector: 'cx-product-list' },
        SearchResultsListComponent: { selector: 'cx-product-list' },
        ProductRefinementComponent: { selector: 'cx-product-facet-navigation' },
      },
    }),
    RouterModule,
    MediaModule,
    AddToCartModule,
    FormComponentsModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    StarRatingModule,
    IconModule,
  ],
  declarations: [
    ProductListComponent,
    ProductFacetNavigationComponent,
    ProductListItemComponent,
    ProductGridItemComponent,
    ProductViewComponent,
  ],
  exports: [
    ProductListComponent,
    ProductListItemComponent,
    ProductGridItemComponent,
  ],
  entryComponents: [ProductListComponent, ProductFacetNavigationComponent],
})
export class ProductListModule {}
