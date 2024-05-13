import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
} from "@angular/core";
import printDoc from "./printDoc.js";

//==========for html to image =======
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
//-----------------------------------

@Component({
  selector: "dmsportal-pdf-export-panel",
  template: `
    <form (ngSubmit)="submitFormHandler($event)" id="content2">
      <h4 class="text-secondary">PDF Export Options</h4>
      <div class="mb-2">
        <input
          class="form-check-input"
          type="radio"
          name="orientation"
          id="landscape"
          value="landscape"
          [checked]="PDF_PAGE_ORITENTATION === 'landscape'"
          (change)="PDF_PAGE_ORITENTATION = $any($event.target).value"
        />
        <label class="form-check-label" for="landscape">
          Landscape
        </label>
        <input
          class="form-check-input"
          type="radio"
          name="orientation"
          id="portrait"
          value="portrait"
          [checked]="PDF_PAGE_ORITENTATION === 'portrait'"
          (change)="PDF_PAGE_ORITENTATION = $any($event.target).value"
        />
        <label class="form-check-label" for="portrait">
          Portrait
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="headerImage"
          [checked]="PDF_WITH_HEADER_IMAGE"
          (change)="PDF_WITH_HEADER_IMAGE = $any($event.target).checked"
        />
        <label class="form-check-label" for="headerImage">
          Header content (Image)
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="footerPageCount"
          [checked]="PDF_WITH_FOOTER_PAGE_COUNT"
          (change)="PDF_WITH_FOOTER_PAGE_COUNT = $any($event.target).checked"
        />
        <label class="form-check-label" for="footerPageCount">
          Footer (page count)
        </label>
      </div>
      <div class="my-2">
        <input
          type="number"
          id="headerRowHeight"
          style="width: 50px; margin-right: 5px"
          [value]="PDF_HEADER_HEIGHT"
          (change)="PDF_HEADER_HEIGHT = parseInt($any($event.target).value)"
        />
        <label for="headerRowHeight">Header height</label>
      </div>
      <div class="my-2">
        <input
          type="number"
          id="cellRowHeight"
          style="width: 50px; margin-right: 5px"
          [value]="PDF_ROW_HEIGHT"
          (change)="PDF_ROW_HEIGHT = parseInt($any($event.target).value)"
        />
        <label for="cellRowHeight">Cell height</label>
      </div>
      <div class="color-picker-container">
        <color-picker [(ngModel)]="PDF_ODD_BKG_COLOR" (ngModelChange)="onOddColorChange($event)" name="odd-bkg-color"></color-picker>
        <div>Odd row background color</div>
      </div>
      <div class="color-picker-container">
        <color-picker [(ngModel)]="PDF_EVEN_BKG_COLOR" (ngModelChange)="onEvenColorChange($event)" name="even-bkg-color"></color-picker>
        <div>Even row background color</div>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="exportWithFormatting"
          [checked]="PDF_WITH_CELL_FORMATTING"
          (change)="PDF_WITH_CELL_FORMATTING = $any($event.target).checked"
        />
        <label class="form-check-label" for="exportWithFormatting">
          Cell styles
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="exportColumnsAsLink"
          [checked]="PDF_WITH_COLUMNS_AS_LINKS"
          (change)="PDF_WITH_COLUMNS_AS_LINKS = $any($event.target).checked"
        />
        <label class="form-check-label" for="exportColumnsAsLink">
          Hyperlinks
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="selectedRowsOnly"
          [checked]="PDF_SELECTED_ROWS_ONLY"
          (change)="PDF_SELECTED_ROWS_ONLY = $any($event.target).checked"
        />
        <label class="form-check-label" for="selectedRowsOnly">
          Selected rows only
        </label>
      </div>
      <button type="submit" class="btn btn-primary mt-3">
        Export to PDF
      </button>
    </form>
  `,
  // template: `
  //  <color-picker [(ngModel)]="PDF_ODD_BKG_COLOR" (ngModelChange)="onColorChange($event)" name="odd-bkg-color"></color-picker>
  //  `
})
export class PDFExportPanelComponent implements OnInit, AfterViewInit {
  @Input() agGridApi: any;
  @Input() agColumnApi: any;
  @Input() searchFldNode: any;

  PDF_HEADER_COLOR = "#f8f8f8";
  PDF_INNER_BORDER_COLOR = "#dde2eb";
  PDF_OUTER_BORDER_COLOR = "#babfc7";
  PDF_LOGO = "http://localhost:4201/assets/bankasialtdlogo.png";
  PDF_PAGE_ORITENTATION = "landscape";
  PDF_WITH_HEADER_IMAGE = true;
  PDF_WITH_FOOTER_PAGE_COUNT = true;
  PDF_HEADER_HEIGHT = 25;
  PDF_ROW_HEIGHT = 15;
  PDF_ODD_BKG_COLOR = "#fcfcfc";
  PDF_EVEN_BKG_COLOR = "#ffffff";
  PDF_WITH_CELL_FORMATTING = true;
  PDF_WITH_COLUMNS_AS_LINKS = true;
  PDF_SELECTED_ROWS_ONLY = false;

  submitFormHandler(event:any) {

    function downloadDataUrl(dataUrl: string, filename: string): void {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a); //Firefox requires link to be in body
      a.click();
      document.body.removeChild(a);
    }

    //const content2 :any = document.getElementById('content2');

    const imgNode:any = this.searchFldNode; //document.getElementById('srcVontent');

    htmlToImage
      .toPng(imgNode)
      .then( (dataUrl)=> {
        // const img = new Image();
        // img.src = dataUrl;        
        // document.body.appendChild(img);
        //===================for creating PDF ==========
        event.preventDefault();
        const printParams = {
          PDF_HEADER_COLOR: this.PDF_HEADER_COLOR,
          PDF_INNER_BORDER_COLOR: this.PDF_INNER_BORDER_COLOR,
          PDF_OUTER_BORDER_COLOR: this.PDF_OUTER_BORDER_COLOR,
          PDF_LOGO: dataUrl,
          PDF_PAGE_ORITENTATION: this.PDF_PAGE_ORITENTATION,
          PDF_WITH_HEADER_IMAGE: this.PDF_WITH_HEADER_IMAGE,
          PDF_WITH_FOOTER_PAGE_COUNT: this.PDF_WITH_FOOTER_PAGE_COUNT,
          PDF_HEADER_HEIGHT: this.PDF_HEADER_HEIGHT,
          PDF_ROW_HEIGHT: this.PDF_ROW_HEIGHT,
          PDF_ODD_BKG_COLOR: this.PDF_ODD_BKG_COLOR,
          PDF_EVEN_BKG_COLOR: this.PDF_EVEN_BKG_COLOR,
          PDF_WITH_CELL_FORMATTING: this.PDF_WITH_CELL_FORMATTING,
          PDF_WITH_COLUMNS_AS_LINKS: this.PDF_WITH_COLUMNS_AS_LINKS,
          PDF_SELECTED_ROWS_ONLY: this.PDF_SELECTED_ROWS_ONLY
        };
        printDoc(printParams, this.agGridApi, this.agColumnApi);
      })
      //.then(dataUrl => downloadDataUrl(dataUrl, "assets/images/user-image.png"))
      .catch((error)=> {
        console.error('oops, something went wrong!', error);
      });


    // event.preventDefault();
    // const printParams = {
    //   PDF_HEADER_COLOR: this.PDF_HEADER_COLOR,
    //   PDF_INNER_BORDER_COLOR: this.PDF_INNER_BORDER_COLOR,
    //   PDF_OUTER_BORDER_COLOR: this.PDF_OUTER_BORDER_COLOR,
    //   PDF_LOGO: this.PDF_LOGO,
    //   PDF_PAGE_ORITENTATION: this.PDF_PAGE_ORITENTATION,
    //   PDF_WITH_HEADER_IMAGE: this.PDF_WITH_HEADER_IMAGE,
    //   PDF_WITH_FOOTER_PAGE_COUNT: this.PDF_WITH_FOOTER_PAGE_COUNT,
    //   PDF_HEADER_HEIGHT: this.PDF_HEADER_HEIGHT,
    //   PDF_ROW_HEIGHT: this.PDF_ROW_HEIGHT,
    //   PDF_ODD_BKG_COLOR: this.PDF_ODD_BKG_COLOR,
    //   PDF_EVEN_BKG_COLOR: this.PDF_EVEN_BKG_COLOR,
    //   PDF_WITH_CELL_FORMATTING: this.PDF_WITH_CELL_FORMATTING,
    //   PDF_WITH_COLUMNS_AS_LINKS: this.PDF_WITH_COLUMNS_AS_LINKS,
    //   PDF_SELECTED_ROWS_ONLY: this.PDF_SELECTED_ROWS_ONLY
    // };
    // printDoc(printParams, this.agGridApi, this.agColumnApi);
  }

  ngOnInit() {
    console.log("");
  }
  
  ngAfterViewInit() {
    console.log("");
  }

  onOddColorChange(color: string) {
    this.PDF_ODD_BKG_COLOR = color;
  }

  onEvenColorChange(color: string) {
    this.PDF_EVEN_BKG_COLOR = color;
  }

  parseInt(val: any) {
    return parseInt(val);
  }

}
