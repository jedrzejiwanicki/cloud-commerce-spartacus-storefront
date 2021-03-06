import { Region } from '../../../model/address.model';

import {
  LoaderLoadAction,
  LoaderFailAction,
  LoaderSuccessAction,
} from '../../../state/utils/loader/loader.action';
import { REGIONS } from '../user-state';
import { Action } from '@ngrx/store';

export const LOAD_REGIONS = '[User] Load Regions';
export const LOAD_REGIONS_SUCCESS = '[User] Load Regions Success';
export const LOAD_REGIONS_FAIL = '[User] Load Regions Fail';
export const CLEAR_REGIONS = '[User] Clear Regions';

export class LoadRegions extends LoaderLoadAction {
  readonly type = LOAD_REGIONS;
  constructor(public payload: string) {
    super(REGIONS);
  }
}

export class LoadRegionsFail extends LoaderFailAction {
  readonly type = LOAD_REGIONS_FAIL;
  constructor(public payload: any) {
    super(REGIONS, payload);
  }
}

export class LoadRegionsSuccess extends LoaderSuccessAction {
  readonly type = LOAD_REGIONS_SUCCESS;
  constructor(public payload: { entities: Region[]; country: string }) {
    super(REGIONS);
  }
}

export class ClearRegions implements Action {
  readonly type = CLEAR_REGIONS;
  constructor() {}
}

export type RegionsAction =
  | LoadRegions
  | LoadRegionsFail
  | LoadRegionsSuccess
  | ClearRegions;
