import { ElementRef, Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { timer, Subscription } from 'rxjs';
import { ProgressContainerComponent } from './progress-container/progress-container.component';
import { DynamicOverlay } from './overlay/dynamic-overlay.service';
import { OverlayRef } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(private dynamicOverlay: DynamicOverlay) { }

  public showProgress(elRef: ElementRef) {
    if (elRef) {
      const result: ProgressRef = { subscription: null as any, overlayRef: null as any };
      result.subscription = timer(500)
        .subscribe(() => {
          this.dynamicOverlay.setContainerElement(elRef.nativeElement);
          const positionStrategy = this.dynamicOverlay.position().global().centerHorizontally().centerVertically();
          result.overlayRef = this.dynamicOverlay.create({
            positionStrategy: positionStrategy,
            hasBackdrop: true
          });
          result.overlayRef.attach(new ComponentPortal(ProgressContainerComponent));
        });
      return result;
    } else {
      return null;
    }
  }

  detach(result: ProgressRef) {
    if (result) {
      result.subscription.unsubscribe();
      if (result.overlayRef) {
        result.overlayRef.detach();
      }
    }
  }
}

export declare type ProgressRef = { subscription: Subscription, overlayRef: OverlayRef };
