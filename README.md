# OTP Input Component with Web OTP API

Bu proje, SMS ile gelen OTP (One-Time Password) kodlarını otomatik olarak yakalayabilen bir Angular bileşeni içerir. Web OTP API kullanarak, kullanıcıların SMS'leri manuel olarak okuyup kodu girmesine gerek kalmadan, otomatik olarak OTP kodlarını doldurabilirsiniz.

## Özellikler

- SMS ile gelen OTP kodlarını otomatik yakalama (Web OTP API desteği olan tarayıcılarda)
- Kullanıcı dostu OTP giriş alanı
- Otomatik odaklanma ve bir sonraki alana geçme
- Yapıştırma desteği
- Sadece sayı girişi kısıtlaması
- Responsive tasarım

## Gereksinimler

- Angular 13 veya üzeri
- Web OTP API desteği olan bir tarayıcı (Chrome 84+, Android üzerinde Chrome, Edge 84+)

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/yourusername/otp-app.git
cd otp-app
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı çalıştırın:
```bash
ng serve
```

## Kullanım

OTP Input bileşenini kullanmak için:

```html
<app-otp-input 
  [length]="6" 
  [allowNumbersOnly]="true"
  [autoFocus]="true"
  [placeholder]="''"
  (otpChange)="onOtpChange($event)"
  (otpComplete)="onOtpComplete($event)">
</app-otp-input>
```

### Parametreler

- `length`: OTP kodunun uzunluğu (varsayılan: 6)
- `allowNumbersOnly`: Sadece sayı girişine izin ver (varsayılan: true)
- `autoFocus`: İlk alana otomatik odaklan (varsayılan: true)
- `disabled`: Giriş alanlarını devre dışı bırak (varsayılan: false)
- `placeholder`: Giriş alanları için placeholder (varsayılan: '')
- `inputStyles`: Giriş alanları için özel stiller (varsayılan: {})
- `inputClass`: Giriş alanları için özel CSS sınıfı (varsayılan: '')

### Olaylar

- `otpChange`: OTP değeri değiştiğinde tetiklenir
- `otpComplete`: OTP girişi tamamlandığında tetiklenir

## Web OTP API Nasıl Çalışır?

Web OTP API, desteklenen tarayıcılarda SMS ile gelen OTP kodlarını otomatik olarak yakalamak için kullanılır. Bu API, aşağıdaki koşullar sağlandığında çalışır:

1. Kullanıcı Android cihazda Chrome 84+ veya diğer desteklenen tarayıcıları kullanıyor olmalıdır.
2. Web sitesi HTTPS üzerinden sunulmalıdır.
3. SMS belirli bir formatta olmalıdır.

### SMS Formatı

Web OTP API'nin çalışması için SMS'in aşağıdaki formatta olması gerekir:

```
<#> Doğrulama kodunuz: 123456
@example.com #abcdef
```

Burada:
- `<#>` SMS'in başında olmalıdır
- `123456` OTP kodudur
- `@example.com` web sitenizin alan adıdır (origin)
- `#abcdef` isteğe bağlı bir tanımlayıcıdır

### Güvenlik Hususları

Web OTP API, yalnızca SMS'in içinde belirtilen alan adı ile eşleşen web sitelerinde çalışır. Bu, OTP kodlarının yalnızca doğru web sitesi tarafından yakalanmasını sağlar.

## Tarayıcı Desteği

Web OTP API şu tarayıcılarda desteklenir:
- Chrome 84+ (Android)
- Edge 84+ (Android)
- Opera 70+ (Android)
- Samsung Internet 14.0+ (Android)

iOS cihazlarda ve masaüstü tarayıcılarda Web OTP API henüz desteklenmemektedir. Bu durumlarda, kullanıcılar OTP kodunu manuel olarak girebilirler.

## Sorun Giderme

1. Web OTP API çalışmıyor:
   - Tarayıcınızın Web OTP API'yi desteklediğinden emin olun
   - Web sitenizin HTTPS üzerinden sunulduğundan emin olun
   - SMS'in doğru formatta olduğundan emin olun
   - Tarayıcı konsolunda hata mesajlarını kontrol edin

2. OTP kodu otomatik olarak doldurulmuyor:
   - Kullanıcının SMS izinlerini verdiğinden emin olun
   - SMS'in doğru formatta olduğundan emin olun
   - Web sitenizin alan adının SMS içinde belirtilen alan adı ile eşleştiğinden emin olun

## Lisans

MIT
