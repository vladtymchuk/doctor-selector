export const getAge = (dateOfBirth: string): number => {
    const [day, month, year]: string[] = dateOfBirth.split('/');
  
    const today: Date = new Date();
    const birthDate: Date = new Date(Number(year), Number(month) - 1, Number(day));
  
    let age: number = today.getFullYear() - birthDate.getFullYear();
  
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    console.log("age", age)
  
    return age;
  }