import { DatePipe } from '@angular/common'
import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { Cv } from './models/cv';
import { Education, Experience, SocialMedia, Skill } from './models/modelCv';
import { enumEducation, enumExperience, enumInfo, enumLanguage, enumPerson, enumSKill, enumSocialMedia } from './enums/enumCv';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { pdfCreator } from './pdf/pdfCreator';
import { LocalizationFunctions } from './core/LocalizationFunctions';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';
import { ButtonModule } from '@openng/optimus-ui/button';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { AvatarUploadComponent } from './shared/avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    SelectButtonModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule,
    AvatarUploadComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public datepipe = inject(DatePipe);

  public localize = inject(LocalizationFunctions);
  private changeDetector = inject(ChangeDetectorRef);

  isInfoMoreChecked = true;
  readonly infoVisibilityOptions = computed(() => [
    { label: this.localize.translate('less'), value: false },
    { label: this.localize.translate('more'), value: true }
  ]);
  cv: Cv;

  enumInfo = enumInfo;
  enumPerson = enumPerson;
  enumExperience = enumExperience;
  enumEducation = enumEducation;
  enumSocialMedia = enumSocialMedia;
  enumSkill = enumSKill;
  enumLanguage = enumLanguage;

  ngOnInit(): void {
    this.resetCv();
  }

  public changelanguage(language: enumLanguage) {
    this.cv.info.language = language;
    this.localize.current = language;
  }

  importCv(event) {
    const f = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      try {
        this.cv = JSON.parse(e.target.result as string);
        this.changelanguage(this.cv.info.language);
      } catch (ex) {
          alert('ex when trying to parse json = ' + ex);
          this.resetCv();
      }
      this.changeDetector.markForCheck();
    }

    reader.readAsText(f);
  }

  exportCv() {
    const filename = "cvmaker_" + this.datepipe.transform(new Date(), 'yyyyMMdd_HHmmss' ) + ".json";
    const dataURI = "data:text/plain;base64," + encodeBase64(JSON.stringify(this.cv));
    saveAs(dataURI, filename);
  }

  resetCv() {
    this.cv = new Cv();
    this.changelanguage(this.cv.info.language);
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
        this.changelanguage(newValue as enumLanguage);
        break;
      default:
        console.log('Cv Info for key [' + key + '] not found');
        break;
    }
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
  }

  onProfileChanged(event) {
    console.log('content changed', event.html);
  }

  addExperience() {
    this.cv.experiences.push(new Experience());
  }

  removeExperience(key: number) {
    this.cv.experiences.splice(key, 1);
  }

  addEducation() {
    this.cv.educations.push(new Education());
  }

  removeEducation(key: number) {
    this.cv.educations.splice(key, 1);
  }

  addSocialMedia() {
    this.cv.socialMedias.push(new SocialMedia());
  }

  removeSocialMedia(key: number) {
    this.cv.socialMedias.splice(key, 1);
  }

  addSkill() {
    this.cv.skills.push(new Skill());
  }

  removeSkill(key: number) {
    this.cv.skills.splice(key, 1);
  }
}
