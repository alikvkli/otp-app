import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  /**
   * Gets the correct SMS format for Web OTP API
   * 
   * @param otpCode The OTP code to be sent
   * @returns A string with the correct SMS format
   */
  getSmsFormat(otpCode: string): string {
    // Get the domain from the current window location
    const domain = window.location.hostname;
    
    return `Your verification code is ${otpCode}.\n\n@${domain} #${otpCode}`;
  }

  /**
   * Checks if Web OTP API is supported in the current browser
   * 
   * @returns boolean indicating if Web OTP API is supported
   */
  isWebOtpSupported(): boolean {
    const isSupported = 'OTPCredential' in window && 
                        'navigator' in window && 
                        'credentials' in navigator;
    
    // Additional check for Android and Chrome
    const isAndroid = /android/i.test(navigator.userAgent);
    const isChrome = /chrome|chromium/i.test(navigator.userAgent);
    
    return isSupported && isAndroid && isChrome;
  }

  /**
   * Logs information about the current environment for debugging
   */
  logEnvironmentInfo(): void {
    console.log('Domain:', window.location.hostname);
    console.log('Web OTP API supported:', this.isWebOtpSupported());
    console.log('User Agent:', navigator.userAgent);
    console.log('Is Android:', /android/i.test(navigator.userAgent));
    console.log('Is Chrome:', /chrome|chromium/i.test(navigator.userAgent));
    console.log('Window.OTPCredential exists:', 'OTPCredential' in window);
    console.log('Navigator.credentials exists:', 'navigator' in window && 'credentials' in navigator);
  }

  /**
   * Prepares the page for Web OTP API
   * This should be called when the app starts
   */
  prepareForWebOtp(): void {
    // Add a meta tag to help browsers identify the app
    this.addWebOtpMetaTag();
  }

  /**
   * Adds a meta tag for Web OTP API
   * This helps browsers identify the app for SMS binding
   */
  private addWebOtpMetaTag(): void {
    // Check if meta tag already exists
    if (document.querySelector('meta[name="otp-meta"]')) {
      return;
    }

    // Create and add meta tag
    const meta = document.createElement('meta');
    meta.name = 'otp-meta';
    meta.content = 'otp-meta';
    document.head.appendChild(meta);
  }
} 