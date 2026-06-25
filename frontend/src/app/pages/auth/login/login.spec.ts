import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockNotificationService: any;

  beforeEach(async () => {
    mockAuthService = {
      loginWithFirebase: jasmine.createSpy('loginWithFirebase').and.returnValue(of({ usuario: { roles: [] } })),
      logout: jasmine.createSpy('logout')
    };

    mockNotificationService = {
      showToast: jasmine.createSpy('showToast')
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default credentials empty', () => {
    expect(component.correo()).toBe('');
    expect(component.password()).toBe('');
    expect(component.selectedRol()).toBe('alumno');
    expect(component.errorMessage()).toBeNull();
  });

  it('should validate form and show error if submitted empty', () => {
    component.onSubmit();
    expect(component.errorMessage()).toBe('Por favor, rellene todos los campos.');
  });

  it('should auto-detect student role based on institutional email pattern with digit prefix', () => {
    component.onCorreoChange('2023204013@unam.edu.pe');
    expect(component.selectedRol()).toBe('alumno');
  });

  it('should auto-detect tutor role based on institutional email pattern without digits prefix', () => {
    component.onCorreoChange('docente.tutor@unam.edu.pe');
    expect(component.selectedRol()).toBe('tutor');
  });
});
