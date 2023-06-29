import { log } from "console";
import { ICity } from "../../../models/ICity";
import { IDoctor } from "../../../models/IDoctor";
import { ISpeciality } from "../../../models/ISpeciality";
import { getAge } from "./date";

export const filterBySexParam = (sexValue: string, doctors: IDoctor[], ISpecialityOptions: ISpeciality[]) => {
    //find spec with nessesary gender or binary
    const filteredSpecialist = ISpecialityOptions.filter(spec => {
      if (!spec.params?.gender) return true 
      if (spec.params.gender && spec.params.gender === sexValue) return true
      return false
    });
    console.log("JJJ", JSON.stringify(filteredSpecialist, null, 3));
    
    // filter doctors by "filteredSpecialist"
    const res = doctors.filter(doctor => Boolean(filteredSpecialist.find(spec => spec.id === doctor.specialityId)))
    return res
}

export const filterByDB = (bdValue: string, doctors: IDoctor[], ISpecialityOptions: ISpeciality[]) => {
    const age = getAge(bdValue)
    const res = doctors.filter(doctor => {
      const maxAge = ISpecialityOptions.find(spec => spec.id === doctor.specialityId)?.params?.maxAge
      const minAge = ISpecialityOptions.find(spec => spec.id === doctor.specialityId)?.params?.minAge
      if (maxAge && age > maxAge) return false;
      if (minAge && age < minAge) return false;
      return true;
    }).filter(selectDoctor => selectDoctor.isPediatrician === (getAge(bdValue) < 18))
    return res
  }

export const filterByCity = (cityValue: string, doctors: IDoctor[], cityOptions: ICity[]) => {
    const cityObj =  cityOptions.find(city => city.name === cityValue)
    const res = doctors.filter(doctor => doctor.cityId === cityObj?.id)
    return res
}

export const filterBySpec = (specValue: string, doctors: IDoctor[], ISpecialityOptions: ISpeciality[]): IDoctor[] => {
    const specObj = ISpecialityOptions.find(spec => spec.name === specValue)
    const res = doctors.filter(doctor => doctor.specialityId === specObj?.id)
    return res
}

export const formatDateString = (value: string): string => {
    let formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters

    if (formattedValue.length > 2) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
    }

    if (formattedValue.length > 5) {
      formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5, 9)}`;
    }

    return formattedValue;
}