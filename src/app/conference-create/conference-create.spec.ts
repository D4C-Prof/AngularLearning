import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ConferenceCreate } from './conference-create';

describe('ConferenceCreate', () => {
  let component: ConferenceCreate;
  let fixture: ComponentFixture<ConferenceCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceCreate],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenceCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial form defaults', () => {
    expect(component.form.get('categorie')?.value).toBe('Frontend');
    expect(component.form.get('placesDisponibles')?.value).toBe(25);
    expect(component.submitted()).toBe(false);
    expect(component.successConference()).toBeNull();
  });
});
