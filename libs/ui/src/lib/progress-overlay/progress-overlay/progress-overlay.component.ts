// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'portal-progress-overlay',
//   templateUrl: './progress-overlay.component.html',
//   styleUrls: ['./progress-overlay.component.css']
// })
// export class ProgressOverlayComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

//===============================
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'portal-progress-overlay',
  templateUrl: './progress-overlay.component.html',
  styleUrls: ['./progress-overlay.component.css'],
  exportAs: 'progressOverlay'
})
export class ProgressOverlayComponent  {

  @HostBinding('class.progress-overlay-section')
  public section: boolean = true;

}

