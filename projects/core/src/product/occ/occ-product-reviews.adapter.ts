import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import { Observable } from 'rxjs';
import { Review } from '../../occ/occ-models/occ.models';
import { ProductReviewsAdapter } from '../connectors/reviews/product-reviews.adapter';
import { ConverterService } from '../../util/converter.service';
import {
  PRODUCT_REVIEW_ADD_SERIALIZER,
  PRODUCT_REVIEWS_LIST_NORMALIZER,
} from '../connectors/reviews/product-reviews.converters';

@Injectable()
export class OccProductReviewsAdapter implements ProductReviewsAdapter {
  constructor(
    private http: HttpClient,
    private occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  loadList(productCode: string, maxCount?: number): Observable<Review[]> {
    return this.http
      .get(this.getEndpoint(productCode, maxCount))
      .pipe(this.converter.pipeable(PRODUCT_REVIEWS_LIST_NORMALIZER));
  }

  post(productCode: string, review: any): Observable<Review> {
    review = this.converter.convert(review, PRODUCT_REVIEW_ADD_SERIALIZER);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.append('headline', review.headline);
    body.append('comment', review.comment);
    body.append('rating', review.rating.toString());
    body.append('alias', review.alias);

    return this.http.post(this.getEndpoint(productCode), body.toString(), {
      headers,
    });
  }

  protected getEndpoint(code: string, maxCount?: number): string {
    return this.occEndpoints.getUrl(
      'productReviews',
      {
        productCode: code,
      },
      { maxCount }
    );
  }
}
