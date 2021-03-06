import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Cart,
  CartDataService,
  CartService,
  I18nTestingModule,
  PromotionResult,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { PromotionsModule } from '../../checkout';
import { Item } from '../cart-shared/cart-item/cart-item.component';
import { CartDetailsComponent } from './cart-details.component';

class MockCartService {
  removeEntry(): void {}
  loadDetails(): void {}
  updateEntry(): void {}
}

@Component({
  template: '',
  selector: 'cx-cart-item-list',
})
class MockCartItemListComponent {
  @Input()
  items: Item[];
  @Input()
  potentialProductPromotions: PromotionResult[] = [];
  @Input()
  cartIsLoading: Observable<boolean>;
}

describe('CartDetailsComponent', () => {
  let component: CartDetailsComponent;
  let fixture: ComponentFixture<CartDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, PromotionsModule, I18nTestingModule],
      declarations: [CartDetailsComponent, MockCartItemListComponent],
      providers: [
        CartDataService,
        { provide: CartService, useClass: MockCartService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create cart details component', () => {
    expect(component).toBeTruthy();
  });

  describe('when cart has potentialOrderPromotions and appliedOrderPromotions are defined', () => {
    it('should have two consumedEntries', () => {
      const mockedCart: Cart = {
        guid: '1',
        potentialOrderPromotions: [
          {
            consumedEntries: [
              {
                orderEntryNumber: 1,
              },
            ],
            description: 'test applied product promotion',
          },
        ],
        appliedOrderPromotions: [
          {
            consumedEntries: [
              {
                orderEntryNumber: 2,
              },
            ],
            description: 'test potential product promotion',
          },
        ],
      };

      const expectedResult: PromotionResult[] = [
        {
          consumedEntries: [
            {
              orderEntryNumber: 1,
            },
          ],
          description: 'test applied product promotion',
        },
        {
          consumedEntries: [
            {
              orderEntryNumber: 2,
            },
          ],
          description: 'test potential product promotion',
        },
      ];

      const promotions = component.getAllPromotionsForCart(mockedCart);
      expect(promotions).toEqual(expectedResult);
    });
  });

  describe('when cart has potentialOrderPromotions is empty and appliedOrderPromotions is defined', () => {
    it('should have two consumedEntries', () => {
      const mockedCart: Cart = {
        guid: '2',
        potentialOrderPromotions: [],
        appliedOrderPromotions: [
          {
            consumedEntries: [
              {
                orderEntryNumber: 2,
              },
            ],
            description: 'test potential product promotion',
          },
        ],
      };

      const expectedResult: PromotionResult[] = [
        {
          consumedEntries: [
            {
              orderEntryNumber: 2,
            },
          ],
          description: 'test potential product promotion',
        },
      ];

      const promotions = component.getAllPromotionsForCart(mockedCart);
      expect(promotions).toEqual(expectedResult);
    });
  });

  describe('when cart has potentialOrderPromotions is defined and appliedOrderPromotions is empty', () => {
    it('should have two consumedEntries', () => {
      const mockedCart: Cart = {
        guid: '3',
        potentialOrderPromotions: [
          {
            consumedEntries: [
              {
                orderEntryNumber: 1,
              },
            ],
            description: 'test applied product promotion',
          },
        ],
        appliedOrderPromotions: [],
      };

      const expectedResult: PromotionResult[] = [
        {
          consumedEntries: [
            {
              orderEntryNumber: 1,
            },
          ],
          description: 'test applied product promotion',
        },
      ];

      const promotions = component.getAllPromotionsForCart(mockedCart);
      expect(promotions).toEqual(expectedResult);
    });
  });

  describe('when cart has potentialOrderPromotions is defined and appliedOrderPromotions is undefined', () => {
    it('should have two consumedEntries', () => {
      const mockedCart: Cart = {
        guid: '4',
        potentialOrderPromotions: [
          {
            consumedEntries: [
              {
                orderEntryNumber: 1,
              },
            ],
            description: 'test applied product promotion',
          },
        ],
      };

      const expectedResult: PromotionResult[] = [
        {
          consumedEntries: [
            {
              orderEntryNumber: 1,
            },
          ],
          description: 'test applied product promotion',
        },
      ];

      const promotions = component.getAllPromotionsForCart(mockedCart);
      expect(promotions).toEqual(expectedResult);
    });
  });

  describe('when cart has potentialOrderPromotions is undefined and appliedOrderPromotions is defined', () => {
    it('should have two consumedEntries', () => {
      const mockedCart: Cart = {
        guid: '5',
        appliedOrderPromotions: [
          {
            consumedEntries: [
              {
                orderEntryNumber: 2,
              },
            ],
            description: 'test potential product promotion',
          },
        ],
      };

      const expectedResult: PromotionResult[] = [
        {
          consumedEntries: [
            {
              orderEntryNumber: 2,
            },
          ],
          description: 'test potential product promotion',
        },
      ];

      const promotions = component.getAllPromotionsForCart(mockedCart);
      expect(promotions).toEqual(expectedResult);
    });
  });
});
