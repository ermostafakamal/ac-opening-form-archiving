import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  forwardRef,
  ViewEncapsulation
} from "@angular/core";
// Needed to be compatible with IE11 that does not support ES6+
// Should be : import Pickr from '@simonwep/pickr';
import Pickr from '@simonwep/pickr';
//import Pickr from "@simonwep/pickr/dist/pickr.es5.min.js";
// import Pickr from '@simonwep/pickr';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "dmsportal-color-picker",
  template: `
    <div #colorPicker></div>
  `,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true
    }
  ]
})
export class ColorPickerComponent
  implements AfterViewInit, ControlValueAccessor {
  public color: string | undefined;

  private pickr: Pickr | undefined;

  @ViewChild("colorPicker", { static: false })
  public colorPicker: ElementRef | undefined;

  /** Callback when the value has changed */
  private onChangeCallback: ((_: any) => void) | undefined ;

  /** Callback when the input has touched */
  private onTouchedCallback: (() => void) | undefined;

  constructor() {console.log("")}

  ngAfterViewInit() {
    this.pickr = Pickr.create({
      el: this.colorPicker?.nativeElement,
      theme: "nano",
      container: "body",
      comparison: false,
      default: "#313b44",
      swatches: [
        // "#fcfcfc",
        // "#ffffff",
        "rgb(244, 67, 54)",
        "rgb(233, 30, 99)",
        "rgb(156, 39, 176)",
        "rgb(103, 58, 183)",
        "rgb(63, 81, 181)",
        "rgb(33, 150, 243)",
        "rgb(3, 169, 244)",
        "rgb(0, 188, 212)",
        "rgb(0, 150, 136)",
        "rgb(76, 175, 80)",
        "rgb(139, 195, 74)",
        "rgb(205, 220, 57)",
        "rgb(255, 235, 59)",
        "rgb(255, 193, 7)"
      ],
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          input: true,
          save: true
        }
      }
    });

    this.pickr.on("init", (instance:any) => {
      this.pickr?.setColor(this.color as string);
    });

    this.pickr.on("save", (color:any, instance:any) => {
      this.color = color.toHEXA().toString();
      // this.pickr.applyColor();
      //this.onChangeCallback(this.color);
      instance.hide();
    });
  }

  /** Implements the ControlValueAccessor to write a new value*/
  public writeValue(color: string): void {
    if (color) {
      this.color = color;
      console.log(color);
      this.pickr?.setColor(color);
    }
  }

  /** Implements the ControlValueAccessor to register the callback funtion */
  public registerOnChange(onChange: (_: any) => void): void {
    this.onChangeCallback = onChange;
  }

  /** Implements the ControlValueAccessor to register the callback funtion */
  public registerOnTouched(onTouched: () => void): void {
    this.onTouchedCallback = onTouched;
    // Due to technical stuff we consider the component touched as soon as we can
    this.onTouchedCallback();
  }
}
