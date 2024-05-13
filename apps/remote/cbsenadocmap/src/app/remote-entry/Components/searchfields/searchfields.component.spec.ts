import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchfieldsComponent } from './searchfields.component';

describe('SearchfieldsComponent', () => {
  let component: SearchfieldsComponent;
  let fixture: ComponentFixture<SearchfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchfieldsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
