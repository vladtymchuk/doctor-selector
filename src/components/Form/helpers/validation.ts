export const validateName = (name: string): string | null => {
    if (!name) {
      return 'Please enter your name.';
    }
  
    if (/\d/.test(name)) {
      return 'Name should not contain numbers.';
    }
  
    return null;
  };
  
  export const validateBirthday = (birthday: string): string | null => {
    if (!birthday) {
      return 'Please enter your birthday date.';
    }
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(birthday)) return 'Please enter in correct format dd/mm/yyyy'
    const [day, month, year] = birthday.split('/');

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    const isValidDate =
      date.getDate() === Number(day) &&
      date.getMonth() === Number(month) - 1 &&
      date.getFullYear() === Number(year);

    if (!isValidDate) return 'Please enter exist date'
    return null;
  };
  
  export const validateEmail = (email: string): string | null => {
    if (!email) {
      return 'Please enter your email.';
    }
    const pattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const ruPattern: RegExp = /\.ru$/;
    if (!pattern.test(email)) {
      return 'Please enter a valid email.';
    }
    if (ruPattern.test(email)) {
        return "No Russia Clients"
    }
  
    return null;
  };
  
  export const validateMobileNumber = (mobileNumber: string): string | null => {
    if (!mobileNumber) {
      return 'Please enter your mobile number.';
    }
  
    if (!/^\d{10}$/.test(mobileNumber)) {
      return 'Please enter a valid 10-digit mobile number.';
    }
  
    return null;
  };
  