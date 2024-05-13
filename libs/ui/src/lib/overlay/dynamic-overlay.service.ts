// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class DynamicOverlayService {

//   constructor() {
//     console.log();
//    }
// }

//==============
import {Overlay, OverlayKeyboardDispatcher, OverlayOutsideClickDispatcher, OverlayPositionBuilder, ScrollStrategyOptions} from '@angular/cdk/overlay';
import {ComponentFactoryResolver, Inject, Injector, Injectable, NgZone, Renderer2, RendererFactory2} from '@angular/core';
import {DynamicOverlayContainer} from './dynamic-overlay-container.service';
import {Directionality} from '@angular/cdk/bidi';
import {DOCUMENT} from '@angular/common';
import { Location as Location_2 } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DynamicOverlay extends Overlay {

  private readonly _dynamicOverlayContainer: DynamicOverlayContainer;
  private renderer: Renderer2;

  constructor(scrollStrategies: ScrollStrategyOptions,
              _overlayContainer: DynamicOverlayContainer,
              _componentFactoryResolver: ComponentFactoryResolver,
              _positionBuilder: OverlayPositionBuilder,
              _keyboardDispatcher: OverlayKeyboardDispatcher,
              _injector: Injector, 
              _ngZone: NgZone, 
              @Inject(DOCUMENT) _document: any, 
              _directionality: Directionality,
              _location: Location_2,
              _outsideClickDispatcher: OverlayOutsideClickDispatcher,
              rendererFactory: RendererFactory2) {
    super(scrollStrategies,_overlayContainer,_componentFactoryResolver,_positionBuilder,_keyboardDispatcher,_injector,_ngZone,_document,_directionality,_location,_outsideClickDispatcher);

    this.renderer = rendererFactory.createRenderer(null, null);

    this._dynamicOverlayContainer = _overlayContainer;
  }

  public setContainerElement(containerElement: HTMLElement): void {
    this.renderer.setStyle(containerElement, 'transform', 'translateZ(0)');
    this._dynamicOverlayContainer.setContainerElement(containerElement);
  }
}


//===================================
// import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
// import { Overlay, OverlayConfig, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
// import { TemplatePortal } from '@angular/cdk/portal';

// @Injectable()

// export class OverlayService {
//     constructor(
//         private overlay: Overlay
//     ) { }
//     createOverlay(config: any): OverlayRef {
//         return this.overlay.create(config);
//     }
//     attachTemplatePortal(overlayRef: OverlayRef, templateRef: TemplateRef<any>, vcRef: ViewContainerRef) {
//         const templatePortal = new TemplatePortal(templateRef, vcRef);
//         overlayRef.attach(templatePortal);
//     }
//     positionGloballyCenter(): PositionStrategy {
//         return this.overlay.position()
//             .global()
//             .centerHorizontally()
//             .centerVertically();
//     }
// }

// // export interface AppOverlayConfig extends OverlayConfig { }
