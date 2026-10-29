import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Conference } from './conference';

describe('Conference', () => {
  let component: Conference;
  let fixture: ComponentFixture<Conference>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Conference],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Conference);
    fixture.componentRef.setInput('conference', {
      id: 1,
      titre: 'Angular 19 & Architecture Moderne',
      intervenant: 'Dr. Jean Dupont',
      date: '15 Mars 2026',
      placesDisponibles: 12,
      estInscrit: false,
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
