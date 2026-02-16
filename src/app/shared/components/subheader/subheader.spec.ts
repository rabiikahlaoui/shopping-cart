import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subheader } from './subheader';

describe('Subheader', () => {
  let fixture: ComponentFixture<Subheader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subheader],
    }).compileComponents();

    fixture = TestBed.createComponent(Subheader);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the title', () => {
    fixture.componentRef.setInput('title', 'Panier');
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Panier');
  });
});
