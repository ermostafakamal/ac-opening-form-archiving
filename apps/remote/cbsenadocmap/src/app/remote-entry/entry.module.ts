import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { remoteRoutes } from './entry.routes';
import { CbstoenadocComponent } from './Components/Cbstoenadoc/Cbstoenadoc.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AngularmaterialModule
} from '@dmsportal/utils';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { SearchfieldsComponent } from './Components/searchfields/searchfields.component';
import { AgGridModule } from 'ag-grid-angular';
import { DashboardshomeComponent } from './Components/dashboardshome/dashboardshome.component';
import { MasterdetailsrendererComponent } from './Components/masterdetailsrenderer/masterdetailsrenderer.component';
import { ParentdashboardlandingComponent } from './Components/parentdashboardlanding/parentdashboardlanding.component';
import { ParentreportlandingComponent } from './Components/parentreportlanding/parentreportlanding.component';
import { ColorPickerComponent } from './Components/pdfExport/color-picker.component';
import { PDFExportPanelComponent } from './Components/pdfExport/pdf-export-panel.component';
@NgModule({
  declarations: [
    RemoteEntryComponent,
    NxWelcomeComponent,
    ColorPickerComponent,
    SearchfieldsComponent,
    CbstoenadocComponent,
    DashboardshomeComponent,
    MasterdetailsrendererComponent,
    ParentdashboardlandingComponent,
    ParentreportlandingComponent,
    PDFExportPanelComponent
  ],
  imports: [
    CommonModule,     
    //HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularmaterialModule,
    FlexLayoutModule,
    AgGridModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.5)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: false,
    }),
    RouterModule.forChild(remoteRoutes)
  ],
  providers: [],
})
export class RemoteEntryModule {}
