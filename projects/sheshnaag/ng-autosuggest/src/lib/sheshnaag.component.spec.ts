import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheshnaagComponent } from './sheshnaag.component';

describe('SheshnaagComponent', () => {
  let component: SheshnaagComponent;
  let fixture: ComponentFixture<SheshnaagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheshnaagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SheshnaagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
