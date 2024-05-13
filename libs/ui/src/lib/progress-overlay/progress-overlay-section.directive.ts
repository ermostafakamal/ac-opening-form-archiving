// import { Directive } from '@angular/core';

// @Directive({
//   selector: '[portalProgressOverlaySection]'
// })
// export class ProgressOverlaySectionDirective {

//   constructor() { }

// }

//==============================
import { Directive, OnChanges, SimpleChanges, OnDestroy, Input, ViewContainerRef, ElementRef } from '@angular/core';
import { Overlay, OverlayRef, ConnectedPositionStrategy, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ProgressOverlayComponent } from './progress-overlay.component';

@Directive({
  selector: '[progressOverlaySection]',
  exportAs: 'progressOverlaySection'
})
export class ProgressOverlaySectionDirective implements OnChanges, OnDestroy {

  @Input('progressOverlaySection')
  public active: boolean;

  private overlayRef: OverlayRef;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private overlay: Overlay
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    const activeChange = changes.active;
    if (activeChange.firstChange || activeChange.previousValue !== activeChange.currentValue) {
      if (this.active) {
        this.show();
      } else if (this.overlayRef) {
        this.overlayRef.detach();
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private getPosition(): ConnectedPositionStrategy {
    return this.overlay.position()
      .connectedTo(this.elementRef, { originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'top' });
  }

  private getOverlayConfig(): OverlayConfig {
    const element: HTMLElement = this.elementRef.nativeElement;
    const elementClientRect = element.getBoundingClientRect();
    return new OverlayConfig({
      positionStrategy: this.getPosition(),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: elementClientRect.width,
      height: elementClientRect.height
    });
  }

  private show(): void {
    if (!this.overlayRef) {
      const config: OverlayConfig = this.getOverlayConfig();
      this.overlayRef = this.overlay.create(config);
    }
    const componentPortal = new ComponentPortal(ProgressOverlayComponent, this.viewContainerRef);
    const componentRef = this.overlayRef.attach(componentPortal);
  }

}

