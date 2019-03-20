import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot } from '@angular/router';

import {
  RoutingService,
  CmsService,
  CmsActivatedRouteSnapshot
} from '@spartacus/core';

import { combineLatest, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CmsRoutesService } from '../services/cms-routes.service';
import { CmsI18NService } from '../services/cms-i18n.service';

@Injectable()
export class CmsPageGuard implements CanActivate {
  static guardName = 'CmsPageGuard';

  constructor(
    private routingService: RoutingService,
    private cmsService: CmsService,
    private cmsRoutes: CmsRoutesService,
    private cmsI18N: CmsI18NService
  ) {}

  canActivate(
    route: CmsActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.routingService.getPageContext().pipe(
      switchMap(pageContext =>
        combineLatest(this.cmsService.hasPage(pageContext), of(pageContext))
      ),
      tap(([hasPage, pageContext]) => {
        if (!hasPage && pageContext.id !== '/notFound') {
          this.routingService.go(['notFound']);
        }
      }),
      tap(([_, pageContext]) => this.cmsI18N.loadNamespaces(pageContext)),
      switchMap(([hasPage, pageContext]) => {
        if (
          hasPage &&
          !route.data.cxCmsRouteContext &&
          !this.cmsRoutes.cmsRouteExist(pageContext.id)
        ) {
          return this.cmsRoutes.handleCmsRoutesInGuard(pageContext, state.url);
        } else {
          return of(hasPage);
        }
      })
    );
  }
}
