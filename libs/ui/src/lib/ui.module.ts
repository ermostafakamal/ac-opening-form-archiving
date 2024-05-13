import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { ResizableComponent } from './resizable/resizable.component';

import {
  //UtilsModule,
  AngularmaterialModule,
  // AccordionLinkDirective,
  // AccordionDirective,
  // AccordionAnchorDirective
} from '@dmsportal/utils';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { HttpClientModule } from '@angular/common/http';
import { ResizableModule } from 'angular-resizable-element';
import { AngularResizeEventModule } from 'angular-resize-event';
import { DragndresizableComponent } from './dragndresizable/dragndresizable.component';
import { DragresizelogolinktileComponent } from './dragresizelogolinktile/dragresizelogolinktile.component';
//import { ResizableanysideComponent } from './resizableanyside/resizableanyside.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverlayModule } from '@angular/cdk/overlay';
import { ProgressContainerComponent } from './progress-container/progress-container.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    AngularmaterialModule,
    FormsModule,
    //HttpClientModule,
    ReactiveFormsModule,
    ResizableModule,
    AngularResizeEventModule,
    OverlayModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule
  ],
  declarations: [
    //ResizableComponent,
    DragndresizableComponent,
    DragresizelogolinktileComponent,
    ProgressContainerComponent
    //ResizableanysideComponent,
  ],
  exports: [
    //ResizableComponent,
    DragndresizableComponent,
    DragresizelogolinktileComponent,
    //ResizableanysideComponent,
  ],
})
export class UiModule {}
