import { DOCUMENT, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, OnInit } from '@angular/core';
import { Cv } from './models/cv';
import { Education, Experience, SocialMedia, Skill } from './models/modelCv';
import { enumEducation, enumExperience, enumInfo, enumLanguage, enumPerson, enumSKill, enumSocialMedia } from './enums/enumCv';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { LocalizationFunctions } from './core/LocalizationFunctions';
import { FormsModule } from '@angular/forms';
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
    ButtonModule,
    SelectButtonModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule,
    AvatarUploadComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public datepipe = inject(DatePipe);

  public localize = inject(LocalizationFunctions);
  private document = inject(DOCUMENT);
  private changeDetector = inject(ChangeDetectorRef);

  isInfoMoreChecked = true;
  readonly infoVisibilityOptions = computed(() => [
    { label: this.localize.translate('less'), value: false },
    { label: this.localize.translate('more'), value: true }
  ]);
  readonly languageOptions = computed(() => [
    { label: this.localize.translate('dutch'), value: enumLanguage.dutch },
    { label: this.localize.translate('english'), value: enumLanguage.english }
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
    this.document.documentElement.lang = language;
  }

  importCv(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!input || !file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedCv = this.normalizeCv(JSON.parse(reader.result as string));
        this.cv = importedCv;
        this.changelanguage(importedCv.info.language);
      } catch {
        alert(this.localize.translate('invalidCvFile'));
      } finally {
        input.value = '';
        this.changeDetector.markForCheck();
      }
    };
    reader.onerror = () => {
      alert(this.localize.translate('invalidCvFile'));
      input.value = '';
      this.changeDetector.markForCheck();
    };

    reader.readAsText(file);
  }

  private normalizeCv(data: unknown): Cv {
    const source = this.asRecord(data);
    const info = this.asRecord(source['info']);
    const person = this.asRecord(source['person']);
    const language = info['language'];

    if (language !== enumLanguage.dutch && language !== enumLanguage.english) {
      throw new Error('Invalid CV language');
    }

    const cv = new Cv();
    cv.info.title = this.readString(info, 'title');
    cv.info.avatar = this.readString(info, 'avatar');
    cv.info.profile = this.readString(info, 'profile');
    cv.info.language = language;

    cv.person.firstName = this.readString(person, 'firstName');
    cv.person.lastName = this.readString(person, 'lastName');
    cv.person.address = this.readString(person, 'address');
    cv.person.zipCode = this.readString(person, 'zipCode');
    cv.person.city = this.readString(person, 'city');
    cv.person.country = this.readString(person, 'country');
    cv.person.email = this.readString(person, 'email');
    cv.person.phone = this.readString(person, 'phone');
    cv.person.driverLicense = this.readString(person, 'driverLicense');
    cv.person.nationality = this.readString(person, 'nationality');
    cv.person.birthCity = this.readString(person, 'birthCity');
    cv.person.birthDate = this.readString(person, 'birthDate');

    cv.experiences = this.normalizeEntries(source['experiences'], () => new Experience(), [
      'function', 'employer', 'startDate', 'endDate', 'city', 'description'
    ]);
    cv.educations = this.normalizeEntries(source['educations'], () => new Education(), [
      'school', 'study', 'startDate', 'endDate', 'city', 'description'
    ]);
    cv.socialMedias = this.normalizeEntries(source['socialMedias'], () => new SocialMedia(), ['label', 'link']);
    cv.skills = this.normalizeEntries(source['skills'], () => new Skill(), ['ability']);

    return cv;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error('Invalid CV data');
    }
    return value as Record<string, unknown>;
  }

  private readString(source: Record<string, unknown>, key: string): string {
    const value = source[key];
    if (value === undefined || value === null) {
      return '';
    }
    if (typeof value !== 'string') {
      throw new Error('Invalid CV field');
    }
    return value;
  }

  private normalizeEntries<T extends object>(value: unknown, create: () => T, fields: string[]): T[] {
    if (!Array.isArray(value)) {
      throw new Error('Invalid CV section');
    }

    return value.map(item => {
      const source = this.asRecord(item);
      const entry = create();
      for (const field of fields) {
        Object.assign(entry, { [field]: this.readString(source, field) });
      }
      return entry;
    });
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

  async createPdf() {
    const { pdfCreator } = await import('./pdf/pdfCreator');
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
