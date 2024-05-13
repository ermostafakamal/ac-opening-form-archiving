import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CbstoenadocComponent } from './Cbstoenadoc.component';

describe('CbstoenadocComponent', () => {
  let component: CbstoenadocComponent;
  let fixture: ComponentFixture<CbstoenadocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CbstoenadocComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CbstoenadocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
