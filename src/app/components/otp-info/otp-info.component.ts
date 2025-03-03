import { Component, OnInit } from '@angular/core';
import { OtpService } from '../../services/otp.service';

@Component({
  selector: 'app-otp-info',
  templateUrl: './otp-info.component.html',
  styleUrls: ['./otp-info.component.scss']
})
export class OtpInfoComponent implements OnInit {
  smsFormat: string = '';
  domain: string = '';
  isWebOtpSupported: boolean = false;
  isAndroid: boolean = false;
  isChrome: boolean = false;

  constructor(private otpService: OtpService) { }

  ngOnInit(): void {
    this.domain = window.location.hostname;
    this.smsFormat = this.otpService.getSmsFormat('123456');
    this.isWebOtpSupported = this.otpService.isWebOtpSupported();
    this.isAndroid = /android/i.test(navigator.userAgent);
    this.isChrome = /chrome/i.test(navigator.userAgent);
  }
} 