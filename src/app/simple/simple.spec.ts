import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Simple } from './simple';

describe('Simple', () => {
  let component: Simple;
  let fixture: ComponentFixture<Simple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Simple]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Simple);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
