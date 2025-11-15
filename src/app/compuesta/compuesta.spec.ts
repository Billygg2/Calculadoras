import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compuesta } from './compuesta';

describe('Compuesta', () => {
  let component: Compuesta;
  let fixture: ComponentFixture<Compuesta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compuesta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Compuesta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
