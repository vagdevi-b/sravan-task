import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef, EventEmitter, Input, OnChanges,
  OnInit, Output,
  Renderer2, SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {OsiMonthPickerComponent} from './osi-month-picker.component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {OsiMonthStruct} from './osi-month-struct';
import {autoClose, monthNumberToName, positionComponentUnderElement} from './utils';
import {OsiMonth} from './osi-month';

/**
 * @author sparnampedu
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'input[osiMonthPicker]',
  exportAs: 'osiMonthPicker',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: OsiInputMonthPicker,
    multi: true
  }],
  host: {
    '(input)': 'manualMonthChange(\'input\')',
    '(change)': 'manualMonthChange(\'change\')'
  }
})
// tslint:disable-next-line:directive-class-suffix
export class OsiInputMonthPicker implements OnInit, OnChanges, ControlValueAccessor {

  @Output()
  monthSelect = new EventEmitter<OsiMonth>();

  @Output()
  closed = new EventEmitter<void>();

  @Input()
  closeOnSelect = true;

  @Input()
  minMonth: OsiMonthStruct;

  @Input()
  maxMonth: OsiMonthStruct;

  private readonly monthPickerInputs: string[] = ['minMonth', 'maxMonth'];

  private cRef: ComponentRef<OsiMonthPickerComponent> | null = null;

  private model: OsiMonth;
  private onChange: (_: any) => {};

  private inputPosition: DOMRect;

  constructor(
      private vcRef: ViewContainerRef,
      private cfr: ComponentFactoryResolver,
      private renderer: Renderer2,
      private changeDetector: ChangeDetectorRef,
      private elRef: ElementRef
  ) {
  }

  private static getHumanFriendlyYearMonth(osiMonthStruct: OsiMonthStruct | null) {
    if (!osiMonthStruct) {
      return '';
    }
    const date = new Date(`${osiMonthStruct.year}-${osiMonthStruct.month}`);

    const monthLongName = monthNumberToName[osiMonthStruct.month];

    return `${monthLongName} ${osiMonthStruct.year}`;
  }

  ngOnInit(): void {
    this.renderer.setAttribute(this.elRef.nativeElement, 'readonly', '');
    this.inputPosition = this.elRef.nativeElement.getBoundingClientRect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.cRef) {
      for (const property of Object.getOwnPropertyNames(changes)) {
        if (this.monthPickerInputs.includes(property)) {
          this.cRef.instance[property] = changes[property].currentValue;
        }
      }
    }
  }

  isOpen() {
    return !!this.cRef;
  }

  open() {
    if (!this.isOpen()) {
      const cf = this.cfr.resolveComponentFactory(OsiMonthPickerComponent);
      this.cRef = this.vcRef.createComponent(cf);
      this.cRef.instance.value = this.model;
      this.setMonthPickerInputs(this.cRef.instance);
      this.subscribeToMonthPickerOutputs(this.cRef.instance);
      this.setRequiredStyles();

      positionComponentUnderElement(
          this.elRef.nativeElement,
          this.cRef.location.nativeElement,
          this.renderer
      );

      autoClose(
          document,
          () => this.close(),
          [this.elRef.nativeElement, this.cRef.location.nativeElement],
          this.closed
      );

      this.cRef.changeDetectorRef.detectChanges();
    }
  }

  close() {
    if (this.isOpen()) {
      this.vcRef.remove(this.vcRef.indexOf(this.cRef.hostView));
      this.cRef = null;
      this.closed.emit();
      this.changeDetector.markForCheck();
    }
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  private setRequiredStyles() {

    this.setStyleOnMonthPicker('border', '0');
    this.setStyleOnMonthPicker('padding', '0');
    this.setStyleOnMonthPicker('position', 'absolute');
    this.setStyleOnMonthPicker('z-index', '1000');
  }

  private setStyleOnMonthPicker(property: string, value: string) {

    if (!this.cRef) {
      return;
    }

    this.renderer.setStyle(
        this.cRef.location.nativeElement,
        property,
        value
    );
  }

  private setMonthPickerInputs(componentInstance) {
    for (const each of this.monthPickerInputs) {
      if (this[each] !== undefined) {
        componentInstance[each] = this[each];
      }
    }
  }

  private subscribeToMonthPickerOutputs(osiMonthPicker: OsiMonthPickerComponent) {

    osiMonthPicker.monthSelect.subscribe((osiMonthStruct) => {
      this.writeValue(osiMonthStruct);
      if (this.closeOnSelect) {
        this.close();
      }
      this.monthSelect.emit(osiMonthStruct);
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(value: OsiMonthStruct | null): void {
    this.model = OsiMonth.from(value);
    if (this.onChange) {
      this.onChange(this.model);
    }

    this.renderer.setProperty(
        this.elRef.nativeElement,
        'value',
        OsiInputMonthPicker.getHumanFriendlyYearMonth(value)
    );
  }

  /**
   * Currently manual editing of the input field is not allowed.
   * So value will be set to null if tried to edit manually.
   */
  manualMonthChange(type: string) {
    this.writeValue(null);
  }
}
