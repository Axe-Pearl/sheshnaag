import {
  AfterViewInit,
  Directive,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewContainerRef,
} from '@angular/core';
import {
  FormControlName,
  FormGroupDirective,
  NgControl,
  UntypedFormControl,
} from '@angular/forms';
import { SuggestorComponent } from './components/helper.component';

@Directive({
  selector: '[autosuggest]',
})
export class AutosuggestionDirective implements AfterViewInit, OnDestroy {
  @Input() contentPlaceHolders!: string[];
  @Input() suggestOn = '@';
  @Output() selectedValue = new EventEmitter<any>();

  private createComponent = true;
  private helperComponent: any;
  private suggestionRequests = '';
  private words: string[] = [];
  private newContentPlaceHolders!: string[];
  private currentPosition: any;
  private targetIndex!: number;
  private currentText = '';
  private control!: UntypedFormControl;

  @HostListener('click', ['$event']) clickedEvent(event: any) {
    this.currentPosition = event.target.selectionEnd;
    this.getTargetIndex();
    this.handleSuggestions();
  }

  @HostListener('focusout') onBlur() {
    setTimeout(() => this.deleteComponent(), 350);
  }

  @HostListener('window:wheel', ['$event']) onScroll(event: any) {
    if (event.target.parentElement.id !== 'autosuggest-scroller') {
      this.deleteComponent();
    }
  }

  @HostListener('keyup', ['$event']) appender(event: any) {
    this.currentPosition = event.target.selectionEnd;
    this.currentText = event.target.value;
    this.getTargetIndex();
    this.generateComponent();
    this.handleSuggestions();
    (event.key === ' ' || event.key === 'Enter') && this.deleteComponent();
  }

  constructor(private vcr: ViewContainerRef, private inj: Injector) {}

  ngAfterViewInit() {
    const injectedControl = this.inj?.get(NgControl);
    if (
      injectedControl !== null &&
      this.inj?.get(FormGroupDirective) !== null
    ) {
      this.control = this.inj
        ?.get(FormGroupDirective)
        ?.getControl(injectedControl as FormControlName);
    }
  }

  generateComponent(): void {
    if (this.createComponent === true) {
      this.helperComponent =
        this.vcr.createComponent<SuggestorComponent>(SuggestorComponent);
      this.helperComponent.instance.newContentPlaceHolders =
        this.newContentPlaceHolders;
      this.helperComponent.instance.stylings = {};
      this.createComponent = false;
    }
    this.setDropdownPosition();
  }

  deleteComponent(): void {
    if (this.vcr) {
      this.vcr.clear();
      this.createComponent = true;
    }
  }

  getTargetIndex(): void {
    this.words = this.customSplitter(
      this.currentText.slice(0, this.currentPosition)
    );
    this.targetIndex = this.words.length - 1;
  }

  setDropdownPosition(): void {
    const field = this.vcr.element.nativeElement;
    const paddings = window.getComputedStyle(field);
    const paddingLeft = parseFloat(paddings.paddingLeft);
    const paddingRight = parseFloat(paddings.paddingRight);
    const paddingTop = parseFloat(paddings.paddingTop);
    const paddingBottom = parseFloat(paddings.paddingBottom);
    const horizontalPadding = paddingLeft + paddingRight;
    const inputRect = field.getBoundingClientRect();

    const newStyling = {
      width: inputRect.width - horizontalPadding + 'px',
      height: inputRect.height + 'px',
      left: inputRect.left + paddingLeft + 'px',
      right: inputRect.right + 'px',
      top: inputRect.top + paddingTop + inputRect.height + 'px',
      bottom: inputRect.bottom + paddingBottom + 'px',
    };
    this.helperComponent.instance.stylings = newStyling;
  }

  filterSuggestions(): void {
    this.suggestionRequests = this.words[this.targetIndex].slice(1);
    this.newContentPlaceHolders = this.contentPlaceHolders?.filter(
      (contentPlaceHolder: string) =>
        contentPlaceHolder
          .toLowerCase()
          .startsWith(this.suggestionRequests.toLowerCase())
    );
  }

  handleSuggestions(): void {
    if (this.words?.[this.targetIndex]?.startsWith(this.suggestOn)) {
      this.filterSuggestions();
      this.helperComponent.instance.newContentPlaceHolders =
        this.newContentPlaceHolders;
      this.helperComponent.instance.suggestOn = this.suggestOn;
      this.helperComponent.instance.onSelection.subscribe((value: any) => {
        this.words[this.targetIndex] = value;
        const newValue: string[] = this.customSplitter();
        newValue.splice(this.targetIndex, 1, value);
        const finalValue = newValue.join('');
        console.log('hey');
        this.control && this.control.patchValue(finalValue);
        this.selectedValue.emit(finalValue);
        this.deleteComponent();
      });
    } else {
      this.deleteComponent();
    }
  }

  customSplitter(str?: string): string[] {
    const arr = [];
    let text = '';
    !str && (str = this.currentText);
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ' ' || str[i] === '\n') {
        text !== '' && arr.push(text);
        arr.push(str[i]);
        text = '';
      } else {
        text += str[i];
      }
    }
    if (text) {
      arr.push(text);
    }
    return arr;
  }

  ngOnDestroy() {
    this.vcr.clear();
  }
}
