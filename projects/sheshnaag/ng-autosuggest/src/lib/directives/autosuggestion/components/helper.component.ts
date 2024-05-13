import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-suggestor',
  templateUrl: './helper.component.html',
  styleUrls: ['./helper.component.scss'],
})
export class SuggestorComponent {
  @Input() newContentPlaceHolders!: string[];
  @Input() suggestOn!: string;
  @Input() stylings: any;
  @Output() onSelection = new EventEmitter<string>();

  constructor() {}

  insertValue(event: any) {
    const value = this.suggestOn + event.target.innerHTML.trim();
    this.onSelection.emit(value);
  }
}
