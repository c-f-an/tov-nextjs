export class PhoneNumber {
  private readonly value: string;

  constructor(value: string) {
    const cleanedValue = this.clean(value);
    if (!this.isValid(cleanedValue)) {
      throw new Error('Invalid phone number format');
    }
    this.value = this.format(cleanedValue);
  }

  private clean(phoneNumber: string): string {
    return phoneNumber.replace(/[^0-9]/g, '');
  }

  private isValid(phoneNumber: string): boolean {
    // Korean phone number validation
    const mobileRegex = /^01[0-9]{8,9}$/;
    const landlineRegex = /^0[2-6][0-9]{7,8}$/;
    
    return mobileRegex.test(phoneNumber) || landlineRegex.test(phoneNumber);
  }

  private format(phoneNumber: string): string {
    if (phoneNumber.startsWith('01')) {
      // Mobile number formatting: 010-1234-5678
      if (phoneNumber.length === 10) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
      } else if (phoneNumber.length === 11) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
      }
    } else {
      // Landline formatting: 02-1234-5678
      const areaCodeLength = phoneNumber.startsWith('02') ? 2 : 3;
      const middleLength = phoneNumber.length === 9 ? 3 : 4;
      
      return `${phoneNumber.slice(0, areaCodeLength)}-${phoneNumber.slice(areaCodeLength, areaCodeLength + middleLength)}-${phoneNumber.slice(areaCodeLength + middleLength)}`;
    }
    
    return phoneNumber;
  }

  getValue(): string {
    return this.value;
  }

  getUnformatted(): string {
    return this.value.replace(/-/g, '');
  }

  equals(other: PhoneNumber): boolean {
    return this.getUnformatted() === other.getUnformatted();
  }
}