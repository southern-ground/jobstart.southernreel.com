import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrlogoComponent } from './srlogo.component';

describe('SrlogoComponent', () => {
  let component: SrlogoComponent;
  let fixture: ComponentFixture<SrlogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrlogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrlogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
