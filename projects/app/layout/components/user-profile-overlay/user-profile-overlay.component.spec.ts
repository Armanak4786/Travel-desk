import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UserProfileOverlayComponent } from "./user-profile-overlay.component";
import { LayoutService } from "../../service/app.layout.service";
import { AuthenticationService } from "auro-ui";
import { Router } from "@angular/router";
import { OverlayPanel, OverlayPanelModule } from "primeng/overlaypanel";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

// --- Mocks ---
class MockLayoutService {} // No longer needs hideOverlay

class MockAuthenticationService {}

class MockRouter {
  navigateByUrl = jasmine.createSpy("navigateByUrl");
}

describe("UserProfileOverlayComponent", () => {
  let component: UserProfileOverlayComponent;
  let fixture: ComponentFixture<UserProfileOverlayComponent>;
  let router: Router;

  // Mock for the OverlayPanel
  const mockOverlayPanel = {
    hide: jasmine.createSpy("hide"),
    toggle: jasmine.createSpy("toggle"),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserProfileOverlayComponent,
        OverlayPanelModule, // Import the PrimeNG module
        NoopAnimationsModule,
      ],
      providers: [
        { provide: LayoutService, useClass: MockLayoutService },
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileOverlayComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Manually set the @ViewChild mock
    component.overlayPanel = mockOverlayPanel as any;

    fixture.detectChanges();
  });

  afterEach(() => {
    // Reset spies after each test
    mockOverlayPanel.hide.calls.reset();
    mockOverlayPanel.toggle.calls.reset();
    (router.navigateByUrl as jasmine.Spy).calls.reset();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call overlayPanel.toggle when toggle() is called", () => {
    const event = new Event("click");
    const target = document.createElement("div");
    component.toggle(event, target);
    expect(mockOverlayPanel.toggle).toHaveBeenCalledWith(event, target);
  });

  it("should call overlayPanel.hide and emit onLogout when logout() is called", () => {
    spyOn(component.onLogout, "emit");

    component.logout();

    expect(mockOverlayPanel.hide).toHaveBeenCalled();
    expect(component.onLogout.emit).toHaveBeenCalled();
  });

  it("should call overlayPanel.hide and navigate when changePassword() is called", () => {
    component.changePassword();

    expect(mockOverlayPanel.hide).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith(
      "/authentication/change-password"
    );
  });

  it("should call overlayPanel.hide when onSettingsClick() is called", () => {
    component.onSettingsClick();
    expect(mockOverlayPanel.hide).toHaveBeenCalled();
  });

  it("should call overlayPanel.hide when onPreferencesClick() is called", () => {
    component.onPreferencesClick();
    expect(mockOverlayPanel.hide).toHaveBeenCalled();
  });

  it("should call overlayPanel.hide when onEditProfileClick() is called", () => {
    component.onEditProfileClick();
    expect(mockOverlayPanel.hide).toHaveBeenCalled();
  });
});