import { NgModule } from '@angular/core';
import { SheshnaagComponent } from './sheshnaag.component';
import { CommonModule } from '@angular/common';
import { SuggestorComponent } from './directives/autosuggestion/components/helper.component';
import { AutosuggestionDirective } from './directives/autosuggestion/autosuggestion-directive.directive';

@NgModule({
  declarations: [
    SheshnaagComponent,
    SuggestorComponent,
    AutosuggestionDirective,
  ],
  imports: [CommonModule],
  exports: [SheshnaagComponent, SuggestorComponent, AutosuggestionDirective],
})
export class SheshnaagModule {}
