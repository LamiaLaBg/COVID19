import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Covid19PerCountyComponent } from './covid19-per-county.component';

describe('Covid19PerCountyComponent', () => {
  let component: Covid19PerCountyComponent;
  let fixture: ComponentFixture<Covid19PerCountyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Covid19PerCountyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Covid19PerCountyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
