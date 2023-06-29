import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Icon,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  DateRange,
  Person,
  Email,
  Phone,
  Wc,
} from '@material-ui/icons';
import { ICity } from '../../models/ICity';
import { ISpeciality } from '../../models/ISpeciality';
import { validateBirthday, validateEmail, validateMobileNumber, validateName } from './helpers/validation';
import { IDoctor } from '../../models/IDoctor';
import { getAge } from './helpers/date';
import { ToastContainer, toast } from 'react-toastify';


const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    maxWidth: '90%',
    margin: '0 auto',
  },
}));

export const Form: React.FC = () => {
  const classes = useStyles();

  //form state
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [sex, setSex] = useState<string>('');
  const [cityOptions, setCityOptions] = useState<ICity[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [ISpecialityOptions, setISpecialityOptions] = useState<ISpeciality[]>([]);
  const [selectedISpeciality, setSelectedISpeciality] = useState('');
  const [doctorOptions, setDoctorOptions] = useState<IDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<IDoctor[]>([]);
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState<IDoctor>({} as IDoctor)

  //error state
  const [formError, setFormError] = useState('');

  const submitNotify = () => toast.success("Form sended!", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });

  const resetNotify = () => toast.error("Cancelled", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });


  useEffect(() => {
    // Fetch city options from API
    axios
      .get<ICity[]>('https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4')
      .then((response) => {
        setCityOptions(response.data);
      })
      .catch((error) => {
        console.log('Error fetching city options:', error);
      });

    // Fetch doctor speciality options from API
    axios
      .get<ISpeciality[]>('https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca')
      .then((response) => {
        setISpecialityOptions(response.data);
      })
      .catch((error) => {
        console.log('Error fetching doctor speciality options:', error);
      });

    // Fetch doctor options from API
    axios
      .get<IDoctor[]>('https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21')
      .then((response) => {
        setDoctorOptions(response.data)
        setFilteredDoctors(response.data)
      })
      .catch((error) => {
        console.log('Error fetching doctor options:', error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Perform form validation
    const nameError = validateName(name);
    const birthdayError = validateBirthday(birthday);
    const emailError = validateEmail(email);
    const mobileNumberError = validateMobileNumber(mobileNumber);

    if (nameError) {
      setFormError(nameError);
      return;
    }

    if (birthdayError) {
      setFormError(birthdayError);
      return;
    }
  
    if (!sex) {
      setFormError('Please select your sex.');
      return;
    }
  
    if (!selectedCity) {
      setFormError('Please select a city.');
      return;
    }
  
    if (!email && !mobileNumber) {
      setFormError('Please enter either an email or a mobile number.');
      return;
    }
  
    if (emailError) {
      setFormError(emailError);
      return;
    }
  
    if (mobileNumberError) {
      setFormError(mobileNumberError);
      return;
    }

    // If the form is valid, perform further actions (e.g., submit to backend)
    setFormError('');
    console.log('Form submitted:', {
      name,
      birthday,
      sex,
      selectedCity,
      selectedISpeciality,
      selectedDoctor,
      email,
      mobileNumber,
    });
    submitNotify()
    clearForm()
  };

  const handleSex = (event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => {
    const { value } = event.target as { value: string };
    setSex(value);
  };

  const filterBySexParam = (sexValue: string, doctors: IDoctor[]) => {
      //find spec with nessesary gender or binary
      const filteredSpecialist = ISpecialityOptions.filter(spec => (!spec.params?.gender || spec.params.gender === sexValue));
      // filter doctors by "filteredSpecialist"
      const res = doctors.filter(doctor => filteredSpecialist.find(spec => spec.id === doctor.specialityId))
      return res
  }

  const formatDateString = (value: string): string => {
    let formattedValue = value.replace(/\D/g, ''); // Remove non-numeric characters

    if (formattedValue.length > 2) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
    }

    if (formattedValue.length > 5) {
      formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5, 9)}`;
    }

    return formattedValue;
  }

  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const formattedValue: string = formatDateString(event.target.value);
    setBirthday(formattedValue)

  }

  const filterByDB = (bdValue: string, doctors: IDoctor[]) => {
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
  const handleCity = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setSelectedCity(event.target.value as string)
    if (selectedDoctorInfo) {
      setSelectedDoctorInfo({} as IDoctor)
      setSelectedDoctor('')
    }
  } 

  const filterByCity = (cityValue: string, doctors: IDoctor[]) => {
    const cityObj =  cityOptions.find(city => city.name === cityValue)
    const res = doctors.filter(doctor => doctor.cityId === cityObj?.id)
    return res
  }

  const handleDoctorSpec = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setSelectedISpeciality(event.target.value as string)
    const speciality = ISpecialityOptions.find(spec => spec.name === event.target.value)
    if (selectedDoctorInfo.toString() === '{}' && speciality && selectedDoctorInfo.specialityId !== speciality?.id) {
      console.log(selectedDoctorInfo)
      setSelectedDoctorInfo({} as IDoctor)
      setSelectedDoctor('')
      setSelectedCity('')
    }
  }

  const filterBySpec = (specValue: string, doctors: IDoctor[]): IDoctor[] => {
    const specObj = ISpecialityOptions.find(spec => spec.name === specValue)
    const res = doctors.filter(doctor => doctor.specialityId === specObj?.id)
    return res
  }

  const doFilterDoctors = () => {
    let doctors: IDoctor[] = doctorOptions
    if (birthday) doctors = filterByDB(birthday, doctors)
    if (sex) doctors = filterBySexParam(sex, doctors)
    if (selectedCity) doctors = filterByCity(selectedCity, doctors) 
    if (selectedISpeciality) doctors = filterBySpec(selectedISpeciality, doctors)
    setFilteredDoctors(doctors)
    if (doctors.length < 1) setSelectedISpeciality('')
  }

  const handleDoctor = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const doctor = filteredDoctors.find(doc => (`${doc.name} ${doc.surname}`) === event.target.value)
    // console.log("doc",doctor)
    if (doctor){
      setSelectedDoctor(`${doctor?.name} ${doctor?.surname}`)
      setDoctorInfo(doctor)
    } else {
      setSelectedISpeciality('')
      console.log("no doctors");
    }

  }

  const setDoctorInfo = (doctor: IDoctor) => {
    const doctorCity = cityOptions.find(city => city.id === doctor.cityId)
    if (doctorCity) setSelectedCity(doctorCity?.name)
    const doctorSpec = ISpecialityOptions.find(spec => spec.id === doctor.specialityId)
    if (doctorSpec) setSelectedISpeciality(doctorSpec.name)
    setSelectedDoctorInfo(doctor)
  }

  const clearForm = () => {
    setName("")
    setBirthday("")
    setSex("")
    setSelectedCity("")
    setSelectedISpeciality("")
    setSelectedDoctor("")
    setEmail("")
    setMobileNumber("")
    setDoctorInfo({} as IDoctor)
  }

  const handleReset = () => {
    resetNotify()
    setFormError('')
    clearForm()
  }

  return (
    <Grid>
      <form className={classes.form} onSubmit={handleSubmit} onReset={handleReset}>
        <TextField
          label="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="Enter your name"
          InputProps={{
            startAdornment: <Person />,
          }}
        />
        <TextField
          fullWidth
          label="Birthday Date"
          // format="dd/mm/yyyy"
          value={birthday}
          type='text'
          // onChange={handleDateOfBD}
          onChange={handleDateInputChange}
          onKeyDown={(event) => {
            if (event.key.length === 1 && !/\d/.test(event.key)) {
              event.preventDefault();
            }
          }}
          required
          placeholder="Enter your birthday date (dd/mm/yyyy)"
          InputProps={{
            startAdornment: <DateRange />,
          }}
          inputProps={{
            
          }}
        />
        <FormControl>
          <InputLabel id="sex-label">Sex</InputLabel>
          <Select
            labelId="sex-label"
            id="sex"
            value={sex}
            onChange={handleSex}
            required
            // startIcon={<Wc />}
          >
             {/* <MenuItem value="">
              <Icon>
                <Wc />
              </Icon>
              Select sex
            </MenuItem> */}
            <MenuItem value="Male">
              <Icon>
                <Wc />
              </Icon>
              Male
            </MenuItem>
            <MenuItem value="Female">
              <Icon>
                <Wc />
              </Icon>
              Female
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="city-label">City</InputLabel>
          <Select
            labelId="city-label"
            id="city"
            value={selectedCity}
            onChange={handleCity}
            required
          >
            {/* <MenuItem value="">Select city</MenuItem> */}
            {cityOptions.map((city) => (
              <MenuItem key={city.id} value={city.name}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="doctor-speciality-label">Doctor Speciality</InputLabel>
          <Select
            labelId="doctor-speciality-label"
            id="ISpeciality"
            value={selectedISpeciality}
            onChange={handleDoctorSpec}
          >
            {/* <MenuItem value="">Select doctor speciality</MenuItem> */}
            {ISpecialityOptions.map((speciality) => (
              <MenuItem key={speciality.id} value={speciality.name}>
                {speciality.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="doctor-label">Doctor</InputLabel>
          <Select
            labelId="doctor-label"
            id="doctor"
            value={selectedDoctor}
            onChange={handleDoctor}
            onOpen={doFilterDoctors}
            required
          >
            {/* <MenuItem value="">Select doctor</MenuItem> */}
            {filteredDoctors.length < 1 && <MenuItem value="">No doctors</MenuItem>}
            {filteredDoctors.map((doctor) => (
              <MenuItem key={doctor.id} value={`${doctor.name} ${doctor.surname}`}>
                {doctor.name} {doctor.surname}
              </MenuItem>
            ))}
            
          </Select>
        </FormControl>
        <TextField
          label="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Enter your email"
          InputProps={{
            startAdornment: <Email />,
          }}
        />
        <TextField
          label="Mobile Number"
          value={mobileNumber}
          onChange={(event) => setMobileNumber(event.target.value)}
          type="tel"
          placeholder="Enter your mobile number"
          InputProps={{
            startAdornment: <Phone />,
          }}
        />
        {formError && <FormHelperText error>{formError}</FormHelperText>}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button variant="contained" type="reset" style={{width: "100%", backgroundColor: "red", color: "#fff"}}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary" type="submit" style={{width: "100%"}}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Grid>
  );
};

