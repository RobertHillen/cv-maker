import { DatePipe } from '@angular/common'
import { Component, OnInit } from '@angular/core';
import { Cv } from './models/cv';
import { Education } from './models/education';
import { Experience } from './models/experience';
import { enumInfo } from './enums/enumInfo';
import { enumPerson } from './enums/enumPerson';
import { enumExperience } from './enums/enumExperience';
import { enumEducation } from './enums/enumEducation';
import { enumSocialMedia } from './enums/enumSocialMedia';
import { SocialMedia } from './models/socialMedia';
import { Skill } from './models/skill';
import { enumSKill } from './enums/enumSkill';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { pdfCreator } from './pdf/pdfCreator';
import { ScriptService } from './pdf/script.service';
import { enumLanguage } from './enums/enumLanguage';
declare let pdfMake: any ;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isInfoMoreChecked = true;
  cv: Cv = new Cv();
  cvLanguage: enumLanguage;

  enumInfo = enumInfo;
  enumPerson = enumPerson;
  enumExperience = enumExperience;
  enumEducation = enumEducation;
  enumSocialMedia = enumSocialMedia;
  enumSkill = enumSKill;
  enumLanguage = enumLanguage;

  constructor (public datepipe: DatePipe, private scriptService: ScriptService) {
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit(): void { }

  importCv(event) {
    var f = event.target.files[0];
    console.log('Importing data from [' + f + ']');

    var reader = new FileReader();
    reader.onload = e => {
      try {
        this.cv = JSON.parse(e.target.result as string);
      } catch (ex) {
          alert('ex when trying to parse json = ' + ex);
          this.resetCv();
      }
    }

    reader.readAsText(f);
  }

  exportCv() {
    const filename = "cvmaker_" + this.datepipe.transform(new Date(), 'yyyyMMdd_HHmmss' ) + ".json";
    console.log('Exporting data to [' + filename + ']');

    const dataURI = "data:text/plain;base64," + encodeBase64(JSON.stringify(this.cv));
    saveAs(dataURI, filename);
  }

  resetCv() {
    this.cv = new Cv();
  }

  createPdf() {
    pdfCreator.generatePDF(this.cv);
  }

  changeInfo(key: enumInfo, newValue: string) {
    switch (key) {
      case enumInfo.title:
        this.cv.info.title = newValue;
        break;
      case enumInfo.avatar:
        this.cv.info.avatar = newValue;
        break;
      case enumInfo.profile:
        this.cv.info.profile = newValue;
        break;
      case enumInfo.language:
        this.cv.info.language = newValue as enumLanguage;
        break;
      default:
        console.log('Cv Info for key [' + key + '] not found');
        break;
    }
    this.consoleCv();
  }

  changePerson(key: enumPerson, newValue: string) {
    switch (key) {
      case enumPerson.firstName:
        this.cv.person.firstName = newValue;
        break;
      case enumPerson.lastName:
        this.cv.person.lastName = newValue;
        break;
      case enumPerson.email:
        this.cv.person.email = newValue;
        break;
      case enumPerson.phone:
        this.cv.person.phone = newValue;
        break;
      case enumPerson.address:
        this.cv.person.address = newValue;
        break;
      case enumPerson.zipCode:
        this.cv.person.zipCode = newValue;
        break;
      case enumPerson.city:
        this.cv.person.city = newValue;
        break;
      case enumPerson.country:
        this.cv.person.country = newValue;
        break;
      case enumPerson.birthCity:
        this.cv.person.birthCity = newValue;
        break;
      case enumPerson.birthDate:
        this.cv.person.birthDate = newValue;
        break;
      case enumPerson.driverLicense:
        this.cv.person.driverLicense = newValue;
        break;
      case enumPerson.nationality:
        this.cv.person.nationality = newValue;
        break;
      default:
        console.log('Cv Person for key [' + key + '] not found');
        break;
    }
    this.consoleCv();
  }

  changeExperience(i: number, key: enumExperience, newValue: string) {
    switch (key) {
      case enumExperience.startDate:
        this.cv.experiences[i].startDate = newValue;
        break;
      case enumExperience.endDate:
        this.cv.experiences[i].endDate = newValue;
        break;
      case enumExperience.employer:
        this.cv.experiences[i].employer = newValue;
        break;
      case enumExperience.city:
        this.cv.experiences[i].city = newValue;
        break;
      case enumExperience.function:
        this.cv.experiences[i].function = newValue;
        break;
      case enumExperience.description:
        this.cv.experiences[i].description = newValue;
        break;
      default:
        console.log('Cv Experience '+ i + ' for key [' + key + '] not found');
        break;
    }
    this.consoleCv();
  }

  changeEducation(i: number, key: enumEducation, newValue: string) {
    switch (key) {
      case enumEducation.startDate:
        this.cv.educations[i].startDate = newValue;
        break;
      case enumEducation.endDate:
        this.cv.educations[i].endDate = newValue;
        break;
      case enumEducation.school:
        this.cv.educations[i].school = newValue;
        break;
      case enumEducation.city:
        this.cv.educations[i].city = newValue;
        break;
      case enumEducation.study:
        this.cv.educations[i].study = newValue;
        break;
      case enumEducation.description:
        this.cv.educations[i].description = newValue;
        break;
      default:
        console.log('Cv Education '+ i + ' for key [' + key + '] not found');
        break;
    }
    this.consoleCv();
  }

  changeSocialMedia(i: number, key: enumSocialMedia, newValue: string) {
    switch (key) {
      case enumSocialMedia.label:
        this.cv.socialMedias[i].label = newValue;
        break;
      case enumSocialMedia.link:
        this.cv.socialMedias[i].link = newValue;
        break;
      default:
        console.log('Cv SocialMedia '+ i + ' for key [' + key + '] not found');
        break;
    }
    this.consoleCv();
  }

  changeSkill(i: number, key: enumSKill, newValue: string) {
    switch (key) {
      case enumSKill.ability:
        this.cv.skills[i].ability = newValue;
        break;
      default:
        console.log('Cv Skill '+ i + ' for key [' + key + '] not found');
        break;
    }
    this.consoleCv();
  }

  onProfileChanged(event) {
    console.log('content changed', event.html);
  }

  addExperience() {
    this.cv.experiences.push(new Experience());
  }

  removeExperience(key: number) {
    this.cv.experiences.splice(key, 1);
    this.consoleCv();
  }

  addEducation() {
    this.cv.educations.push(new Education());
  }

  removeEducation(key: number) {
    this.cv.educations.splice(key, 1);
    this.consoleCv();
  }

  addSocialMedia() {
    this.cv.socialMedias.push(new SocialMedia());
  }

  removeSocialMedia(key: number) {
    this.cv.socialMedias.splice(key, 1);
    this.consoleCv();
  }

  addSkill() {
    this.cv.skills.push(new Skill());
  }

  removeSkill(key: number) {
    this.cv.skills.splice(key, 1);
    this.consoleCv();
  }

  consoleCv() {
    // console.log('Title [' + this.cv.info.title + ']');
    // if (this.cv.info.avatar !== undefined) {
    //   console.log('Avatar.length [' + this.cv.info.avatar.length + ']');
    // }
    // console.log('Profile [' + this.cv.info.profile + ']');
    // console.log('Language [' + this.cv.info.language + ']');

    // console.log('FirstName [' + this.cv.person.firstName + ']');
    // console.log('LastName [' + this.cv.person.lastName + ']');
    // console.log('Email [' + this.cv.person.email + ']');
    // console.log('Phone [' + this.cv.person.phone + ']');
    // console.log('Address [' + this.cv.person.address + ']');
    // console.log('Zipcode [' + this.cv.person.zipCode + ']');
    // console.log('City [' + this.cv.person.city + ']');
    // console.log('Country [' + this.cv.person.country + ']');
    // console.log('BirthCity [' + this.cv.person.birthCity + ']');
    // console.log('BirthDate [' + this.cv.person.birthDate + ']');
    // console.log('DriverLicense [' + this.cv.person.driverLicense + ']');
    // console.log('Nationality [' + this.cv.person.nationality + ']');

    // this.cv.experiences.forEach(function (experience) {
    //   console.log('Experience.startDate [' + experience.startDate + ']');
    //   console.log('Experience.endDate [' + experience.endDate + ']');
    //   console.log('Experience.employer [' + experience.employer + ']');
    //   console.log('Experience.city [' + experience.city + ']');
    //   console.log('Experience.function [' + experience.function + ']');
    //   console.log('Experience.description [' + experience.description + ']');
    // });

    // this.cv.educations.forEach(function (education) {
    //   console.log('Education.startDate [' + education.startDate + ']');
    //   console.log('Education.endDate [' + education.endDate + ']');
    //   console.log('Education.school [' + education.school + ']');
    //   console.log('Education.city [' + education.city + ']');
    //   console.log('Education.study [' + education.study + ']');
    //   console.log('Education.description [' + education.description + ']');
    // });

    // this.cv.socialMedias.forEach(function (socialMedia) {
    //   console.log('socialMedia.label [' + socialMedia.label + ']');
    //   console.log('socialMedia.link [' + socialMedia.link + ']');
    // });

    // this.cv.skills.forEach(function (skill) {
    //   console.log('skill.ability [' + skill.ability + ']');
    // });

    // console.log('------------------------------');
  }
}
