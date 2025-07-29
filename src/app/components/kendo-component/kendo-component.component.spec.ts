import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KendoComponentComponent } from './kendo-component.component';

describe('KendoComponentComponent', () => {
  let component: KendoComponentComponent;
  let fixture: ComponentFixture<KendoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KendoComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KendoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
