import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NebulaBackgroundComponent } from './nebula-background';

describe('NebulaBackground', () => {
  let component: NebulaBackgroundComponent;
  let fixture: ComponentFixture<NebulaBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NebulaBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NebulaBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
