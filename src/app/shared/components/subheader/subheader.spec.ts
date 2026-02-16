import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subheader } from './subheader';

describe('Subheader', () => {
  let component: Subheader;
  let fixture: ComponentFixture<Subheader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subheader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subheader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
