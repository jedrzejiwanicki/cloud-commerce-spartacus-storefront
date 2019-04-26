import { TestBed } from '@angular/core/testing';
import { RoutingConfig } from './config/routing-config';
import { RoutingConfigService } from './routing-config.service';
import { RoutesConfig } from './routes-config';

class MockRoutingConfig {
  routing: RoutesConfig = {
    routes: {
        page1: {
          paths: ['default-path1'],
          paramsMapping: { param1: 'mappedParam1' },
        },
        page2: { paths: ['default-path2', 'default-path20'] },
        page3: { paths: ['default-path3'] },
      },
    },
  };
}

describe('RoutingConfigService', () => {
  let service: RoutingConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RoutingConfigService,
        {
          provide: RoutingConfig,
          useClass: MockRoutingConfig,
        },
      ],
    });

    service = TestBed.get(RoutingConfigService);
  });

  describe('getRouteTranslation', () => {
    it('should return configured paths translations for given page name', async () => {
      service['_routesConfig'] = {
        page1: { paths: ['path1', 'path10'] },
      };
      const expectedResult = { paths: ['path1', 'path10'] };
      expect(service.getRouteTranslation('page1')).toEqual(expectedResult);
    });
  });
});