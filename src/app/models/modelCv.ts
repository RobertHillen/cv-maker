import { enumLanguage } from '../enums/enumCv';

class Education {
  school: string;
  study: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
}

class Experience {
  function: string;
  employer: string;
  startDate: string;
  endDate: string;
  city: string;
  description: string;
}

class Info {
  title: string;
  avatar: string;
  profile: string;
  language: enumLanguage;
}

class Localization {
  id: string;
  value: string;
}

class Person {
  firstName: string;
  lastName: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  driverLicense: string;
  nationality: string;
  birthCity: string;
  birthDate: string;
}

class Skill {
  ability: string;
}

class SocialMedia {
  label: string;
  link: string;
}

export { Education, Experience, Info, Localization, Person, Skill, SocialMedia };
