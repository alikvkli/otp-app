import { Component, OnInit, ViewChild } from '@angular/core';
import { OtpInputComponent } from './components/otp-input/otp-input.component';
import { OtpService } from './services/otp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'otp-app';
  otpValue: string = '';
  isOtpComplete: boolean = false;

  @ViewChild(OtpInputComponent) otpInput!: OtpInputComponent;
  
  constructor(private otpService: OtpService) {}
  
  ngOnInit(): void {
    // Prepare the app for Web OTP API
    this.otpService.prepareForWebOtp();
    this.otpService.logEnvironmentInfo();
  }
  
  onOtpChange(otp: string): void {
    this.otpValue = otp;
    // Reset complete status when OTP changes
    if (otp.length !== 6) {
      this.isOtpComplete = false;
    }
  }

  onOtpComplete(otp: string): void {
    this.isOtpComplete = true;
    this.otpValue = otp;
    console.log('OTP completed:', otp);
    // Burada OTP doğrulama işlemini yapabilirsiniz
  }

  clearOtp(): void {
    this.otpInput.clearOtp();
    this.isOtpComplete = false;
    this.otpValue = '';
  }
}
