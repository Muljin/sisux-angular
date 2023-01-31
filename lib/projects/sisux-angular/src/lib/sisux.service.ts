import { Inject, Injectable } from '@angular/core';
import {
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
} from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SisuxService {
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private _msalGuardConfig: MsalGuardConfiguration,
    private _authService: MsalService,
    private _msalBroadcastService: MsalBroadcastService
  ) {}

  private readonly _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  private readonly _destroying$ = new Subject<void>();

  init(): void {
    this._msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this._setLoggedIn();
        this._checkAndSetActiveAccount();
      });
  }

  private _setLoggedIn() {
    const loggedIn = this._authService.instance.getAllAccounts().length > 0;
    this._isLoggedIn$.next(loggedIn);
  }

  private _checkAndSetActiveAccount() {
    let activeAccount = this._authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this._authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this._authService.instance.getAllAccounts();
      this._authService.instance.setActiveAccount(accounts[0]);
    }
  }

  login(): void {
    if (this._msalGuardConfig.authRequest) {
      this._authService.loginRedirect({
        ...this._msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this._authService.loginRedirect();
    }
  }

  logout(): void {
    this._authService.logoutRedirect();
  }

  destroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
