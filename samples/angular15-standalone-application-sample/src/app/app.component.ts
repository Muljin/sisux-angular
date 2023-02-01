import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SisuxService } from 'sisux-angular';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private _sisuxService = inject(SisuxService);

  ngOnInit() {
    this._sisuxService.init();
  }

  ngOnDestroy(): void {
    this._sisuxService.destroy();
  }
}
