import { InjectionToken, Provider } from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  MetaReducer,
} from '@ngrx/store';
import { loaderReducer } from '../../../state/utils/loader/loader.reducer';
import { ClientToken, OpenIdToken } from '../../models/token-types.model';
import { LOGOUT } from '../actions/login-logout.action';
import {
  AuthState,
  CLIENT_TOKEN_DATA,
  OPEN_ID_TOKEN_DATA,
} from '../auth-state';
import * as fromUserTokenReducer from './user-token.reducer';

export function getReducers(): ActionReducerMap<AuthState> {
  return {
    userToken: combineReducers({ token: fromUserTokenReducer.reducer }),
    clientToken: loaderReducer<ClientToken>(CLIENT_TOKEN_DATA),
    openIdToken: loaderReducer<OpenIdToken>(OPEN_ID_TOKEN_DATA),
  };
}

export const reducerToken: InjectionToken<
  ActionReducerMap<AuthState>
> = new InjectionToken<ActionReducerMap<AuthState>>('AuthReducers');

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};

export function clearAuthState(
  reducer: ActionReducer<AuthState, Action>
): ActionReducer<AuthState, Action> {
  return function(state, action) {
    if (action.type === LOGOUT) {
      state = {
        ...state,
        userToken: undefined,
        openIdToken: undefined,
      };
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<any>[] = [clearAuthState];
