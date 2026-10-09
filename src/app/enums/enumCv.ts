enum enumEducation {
  school,
  study,
  startDate,
  endDate,
  city,
  description
}

enum enumExperience {
  startDate,
  endDate,
  employer,
  city,
  function,
  description
}

enum enumInfo {
  title,
  avatar,
  profile,
  language
}

enum enumLanguage {
  dutch = 'nl',
  english = 'en',
}

enum enumPerson {
  firstName,
  lastName,
  email,
  phone,
  address,
  zipCode,
  city,
  country,
  birthCity,
  birthDate,
  driverLicense,
  nationality
}

enum enumSKill {
  ability
}

enum enumSocialMedia {
  label,
  link
}

export { enumEducation, enumExperience, enumInfo, enumLanguage, enumPerson, enumSKill, enumSocialMedia };
