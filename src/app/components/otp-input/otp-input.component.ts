import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChildren, QueryList, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OtpService } from '../../services/otp.service';

// Web OTP API için tip tanımlamaları
declare global {
  interface OTPCredential {
    code: string;
  }
}

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss']
})
export class OtpInputComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() length: number = 6;
  @Input() allowNumbersOnly: boolean = true;
  @Input() autoFocus: boolean = true;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() inputStyles: { [key: string]: any } = {};
  @Input() inputClass: string = '';
  
  @Output() otpChange = new EventEmitter<string>();
  @Output() otpComplete = new EventEmitter<string>();

  otpForm: FormControl[] = [];
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  private webOtpSupported = false;
  private abortController: AbortController | null = null;

  constructor(
    private ngZone: NgZone,
    private otpService: OtpService
  ) {
    // Initialize form controls based on length
    for (let i = 0; i < this.length; i++) {
      this.otpForm.push(new FormControl(''));
    }
  }

  ngOnInit(): void {
    // Check if Web OTP API is supported
    this.webOtpSupported = this.otpService.isWebOtpSupported();
    console.log('Web OTP API supported:', this.webOtpSupported);
    
    // Log environment info for debugging
    this.otpService.logEnvironmentInfo();
    
    // Start listening for OTP if supported
    if (this.webOtpSupported) {
      this.startWebOtpListener();
    }
  }

  ngAfterViewInit(): void {
    if (this.autoFocus) {
      this.setFocus(0);
    }
  }

  /**
   * Starts listening for SMS via Web OTP API
   */
  private startWebOtpListener(): void {
    if (!this.webOtpSupported) return;

    console.log('Starting Web OTP listener...');

    // Wait for the DOM to be fully loaded
    setTimeout(() => {
      // Try to find the form element
      const form = document.getElementById('otp-form');
      if (!form) {
        console.error('OTP form element not found');
        return;
      }

      // Find or create a hidden input with autocomplete="one-time-code"
      let hiddenInput = form.querySelector('input[autocomplete="one-time-code"][style*="opacity: 0"]') as HTMLInputElement;
      if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.type = 'text';
        hiddenInput.autocomplete = 'one-time-code';
        hiddenInput.style.position = 'absolute';
        hiddenInput.style.opacity = '0';
        hiddenInput.style.pointerEvents = 'none';
        form.appendChild(hiddenInput);
      }

      // Add a click event listener to the form to focus the hidden input
      form.addEventListener('click', () => {
        setTimeout(() => {
          hiddenInput.focus();
          console.log('Focused hidden input after form click');
        }, 100);
      });

      // Start listening for SMS
      this.listenForWebOtp();
    }, 500);
  }

  /**
   * Listens for OTP using Web OTP API
   * 
   * Note: For this to work, the SMS must be in the following format:
   * Your verification code is 123456.
   * 
   * @example.com #123456
   * 
   * Where example.com is your domain and 123456 is the OTP code.
   */
  private listenForWebOtp(): void {
    if (!this.webOtpSupported || !navigator.credentials) return;

    console.log('Starting Web OTP listener...');

    // The AbortController is used to abort the OTP retrieval if the component is destroyed
    this.abortController = new AbortController();
    
    try {
      // Find the hidden input for Web OTP API
      const form = document.getElementById('otp-form');
      const hiddenInput = form?.querySelector('input[autocomplete="one-time-code"]') as HTMLInputElement;
      
      if (hiddenInput) {
        console.log('Found hidden input for Web OTP API');
        
        // Focus the hidden input to trigger the browser's OTP UI
        setTimeout(() => {
          hiddenInput.focus();
          console.log('Focused hidden input for Web OTP API');
        }, 1000);
      }

      // @ts-ignore - Web OTP API is not yet in TypeScript's standard types
      navigator.credentials.get({
        // @ts-ignore
        otp: { transport: ['sms'] },
        signal: this.abortController.signal
      })
      .then((otp: any) => {
        console.log('OTP received:', otp);
        if (otp && otp.code) {
          // Run inside NgZone to trigger change detection
          this.ngZone.run(() => {
            console.log('Filling OTP code:', otp.code);
            // Manually fill each input field with the OTP code
            const otpCode = otp.code;
            for (let i = 0; i < Math.min(this.length, otpCode.length); i++) {
              this.otpForm[i].setValue(otpCode.charAt(i));
            }
            // Emit the OTP value and complete event
            this.emitOtpValue();
            if (this.isOtpComplete()) {
              this.emitOtpComplete();
            }
          });
        }
      })
      .catch(error => {
        // Ignore AbortError which happens when the component is destroyed
        if (error.name !== 'AbortError') {
          console.error('Error retrieving OTP:', error);
        }
      });
    } catch (error) {
      console.error('Error starting Web OTP listener:', error);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const isDigit = /^\d$/.test(event.key);
    const isBackspace = event.key === 'Backspace';
    const isArrowLeft = event.key === 'ArrowLeft';
    const isArrowRight = event.key === 'ArrowRight';
    const isTab = event.key === 'Tab';
    
    // Allow navigation keys
    if (isBackspace || isArrowLeft || isArrowRight || isTab) {
      return;
    }
    
    // If numbers only and not a digit, prevent default
    if (this.allowNumbersOnly && !isDigit) {
      event.preventDefault();
      return;
    }
  }

  onKeyUp(event: KeyboardEvent, index: number): void {
    const isBackspace = event.key === 'Backspace';
    const isArrowLeft = event.key === 'ArrowLeft';
    const isArrowRight = event.key === 'ArrowRight';
    
    if (isBackspace) {
      this.handleBackspace(index);
    } else if (isArrowLeft) {
      this.setFocus(Math.max(0, index - 1));
    } else if (isArrowRight) {
      this.setFocus(Math.min(this.length - 1, index + 1));
    } else {
      this.handleInput(index);
    }
    
    this.emitOtpValue();
  }

  onInput(index: number): void {
    const value = this.otpForm[index].value;
    
    // If the input has a value and it's not the last input, move focus to the next input
    if (value !== '' && index < this.length - 1) {
      this.setFocus(index + 1);
    }
    
    this.emitOtpValue();
    
    // Check if OTP is complete
    if (this.isOtpComplete()) {
      this.emitOtpComplete();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    
    if (this.disabled) {
      return;
    }
    
    const clipboardData = event.clipboardData;
    if (clipboardData) {
      const pastedData = clipboardData.getData('text').trim();
      
      // If pasted data is numeric and matches the expected length
      if (this.allowNumbersOnly && !/^\d+$/.test(pastedData)) {
        return;
      }
      
      // Fill the OTP inputs with the pasted data
      const otpCode = pastedData;
      for (let i = 0; i < Math.min(this.length, otpCode.length); i++) {
        this.otpForm[i].setValue(otpCode.charAt(i));
      }
      // Emit the OTP value and complete event
      this.emitOtpValue();
      if (this.isOtpComplete()) {
        this.emitOtpComplete();
      }
    }
  }

  private handleBackspace(index: number): void {
    // If current input is empty and not the first input, move focus to previous input
    if (this.otpForm[index].value === '' && index > 0) {
      this.setFocus(index - 1);
    }
  }

  private handleInput(index: number): void {
    // If current input has a value and not the last input, move focus to next input
    if (this.otpForm[index].value !== '' && index < this.length - 1) {
      this.setFocus(index + 1);
    }
  }

  private setFocus(index: number): void {
    if (!this.disabled) {
      setTimeout(() => {
        const inputElements = this.otpInputs.toArray();
        if (inputElements[index]) {
          inputElements[index].nativeElement.focus();
        }
      }, 0);
    }
  }

  private emitOtpValue(): void {
    const otp = this.otpForm.map(control => control.value).join('');
    this.otpChange.emit(otp);
  }

  private emitOtpComplete(): void {
    const otp = this.otpForm.map(control => control.value).join('');
    this.otpComplete.emit(otp);
  }

  private isOtpComplete(): boolean {
    return this.otpForm.every(control => control.value !== '');
  }

  // Public method to clear the OTP input
  public clearOtp(): void {
    this.otpForm.forEach(control => control.setValue(''));
    if (this.autoFocus) {
      this.setFocus(0);
    }
  }

  // Cleanup when component is destroyed
  ngOnDestroy(): void {
    // Abort any pending OTP requests
    if (this.abortController) {
      this.abortController.abort();
    }
  }
} 