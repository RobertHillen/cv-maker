import { enumLanguage } from '../enums/enumCv';

class Education {
  school = '';
  study = '';
  startDate = '';
  endDate = '';
  city = '';
  description = '';
}

class Experience {
  function = '';
  employer = '';
  startDate = '';
  endDate = '';
  city = '';
  description = '';
}

class Info {
  title = '';
  avatar = '';
  profile = '';
  language: enumLanguage;
}

class Localization {
  id: string;
  value: string;
}

class Person {
  firstName = '';
  lastName = '';
  address = '';
  zipCode = '';
  city = '';
  country = '';
  email = '';
  phone = '';
  driverLicense = '';
  nationality = '';
  birthCity = '';
  birthDate = '';
}

class Skill {
  ability = '';
}

class SocialMedia {
  label = '';
  link = '';
}

export { Education, Experience, Info, Localization, Person, Skill, SocialMedia };
