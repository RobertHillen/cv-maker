import { DOCUMENT, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, computed, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { Cv } from './models/cv';
import { Education, Experience, SocialMedia, Skill } from './models/modelCv';
import { enumLanguage } from './enums/enumCv';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { LocalizationFunctions } from './core/LocalizationFunctions';
import { Subscription } from 'rxjs';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from '@openng/optimus-ui/button';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { DatePickerModule } from '@openng/optimus-ui/datepicker';
import { AvatarUploadComponent } from './shared/avatar-upload/avatar-upload.component';
import { MenubarModule } from '@openng/optimus-ui/menubar';
import { MenuItem } from '@openng/optimus-ui/api';
import { CardModule } from '@openng/optimus-ui/card';
import { BadgeModule } from '@openng/optimus-ui/badge';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    SelectButtonModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule,
    DatePickerModule,
    AvatarUploadComponent,
    MenubarModule,
    CardModule,
    BadgeModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public datepipe = inject(DatePipe);
  public localize = inject(LocalizationFunctions);

  private document = inject(DOCUMENT);
  private changeDetector = inject(ChangeDetectorRef);
  private uploader = viewChild.required<ElementRef<HTMLInputElement>>('uploader');

  private formSubscription?: Subscription;
  readonly menuItems = computed<MenuItem[]>(() => [
    {
      label: this.localize.translate('open'),
      icon: 'fa-solid fa-folder-open',
      command: () => this.importCv()
    },
    {
      label: this.localize.translate('save'),
      icon: 'fa-solid fa-floppy-disk',
      command: () => this.exportCv()
    },
    {
      label: this.localize.translate('reset'),
      icon: 'fa-solid fa-circle-xmark',
      command: () => this.resetCv()
    },
    {
      label: this.localize.translate('exportPdf'),
      icon: 'fa-solid fa-file-pdf',
      command: () => this.createPdf()
    }
  ]);

  get isInfoMoreChecked(): boolean {
    return this.visibilityControl.value;
  }

  readonly infoVisibilityOptions = computed(() => [
    { label: this.localize.translate('less'), value: false },
    { label: this.localize.translate('more'), value: true }
  ]);
  readonly languageOptions = computed(() => [
    { label: this.localize.translate('dutch'), value: enumLanguage.dutch },
    { label: this.localize.translate('english'), value: enumLanguage.english }
  ]);

  cv: Cv;
  cvForm: FormGroup;
  visibilityControl = new FormControl(true, { nonNullable: true });
  pdfValidationError = false;

  enumLanguage = enumLanguage;

  ngOnInit(): void {
    this.resetCv();
  }

  // INITIALIZE FORM
  private initializeForm() {
    this.formSubscription?.unsubscribe();
    this.cvForm = new FormGroup({
      language: new FormControl(this.cv.info.language, { nonNullable: true }),
      title: new FormControl(this.cv.info.title, { nonNullable: true, validators: [Validators.required] }),
      avatar: new FormControl(this.cv.info.avatar, { nonNullable: true }),
      profile: new FormControl(this.cv.info.profile, { nonNullable: true }),
      firstName: new FormControl(this.cv.person.firstName, { nonNullable: true, validators: [Validators.required] }),
      lastName: new FormControl(this.cv.person.lastName, { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl(this.cv.person.email, { nonNullable: true, validators: [Validators.required, Validators.email] }),
      city: new FormControl(this.cv.person.city, { nonNullable: true, validators: [Validators.required] }),
      address: new FormControl(this.cv.person.address, { nonNullable: true }),
      zipCode: new FormControl(this.cv.person.zipCode, { nonNullable: true }),
      phone: new FormControl(this.cv.person.phone, { nonNullable: true }),
      country: new FormControl(this.cv.person.country, { nonNullable: true }),
      birthDate: new FormControl(this.cv.person.birthDate, { nonNullable: true }),
      birthCity: new FormControl(this.cv.person.birthCity, { nonNullable: true }),
      driverLicense: new FormControl(this.cv.person.driverLicense, { nonNullable: true }),
      nationality: new FormControl(this.cv.person.nationality, { nonNullable: true }),
      experiences: this.createFormArray(this.cv.experiences),
      educations: this.createFormArray(this.cv.educations, ['endDate', 'school', 'city', 'description']),
      socialMedias: this.createFormArray(this.cv.socialMedias),
      skills: this.createFormArray(this.cv.skills),
    });
    this.formSubscription = this.cvForm.valueChanges.subscribe(() => this.syncCvFromForm());
  }

  private createFormArray<T extends object>(entries: T[], optionalFields: string[] = []): FormArray {
    return new FormArray(entries.map(entry => this.createEntryGroup(entry, optionalFields)));
  }

  private createEntryGroup<T extends object>(entry: T, optionalFields: string[] = []): FormGroup {
    return new FormGroup(Object.fromEntries(Object.entries(entry).map(([key, value]) => [
      key,
      new FormControl(value, {
        nonNullable: true,
        validators: optionalFields.includes(key) ? [] : [Validators.required],
      }),
    ])));
  }

  private syncCvFromForm() {
    const value = this.cvForm.getRawValue();
    this.cv.info.title = value.title;
    this.cv.info.avatar = value.avatar;
    this.cv.info.profile = value.profile;
    this.cv.person.firstName = value.firstName;
    this.cv.person.lastName = value.lastName;
    this.cv.person.email = value.email;
    this.cv.person.city = value.city;
    this.cv.person.address = value.address;
    this.cv.person.zipCode = value.zipCode;
    this.cv.person.phone = value.phone;
    this.cv.person.country = value.country;
    this.cv.person.birthDate = value.birthDate;
    this.cv.person.birthCity = value.birthCity;
    this.cv.person.driverLicense = value.driverLicense;
    this.cv.person.nationality = value.nationality;
    this.cv.experiences = value.experiences.map((entry: Experience) => Object.assign(new Experience(), entry));
    this.cv.educations = value.educations.map((entry: Education) => Object.assign(new Education(), entry));
    this.cv.socialMedias = value.socialMedias.map((entry: SocialMedia) => Object.assign(new SocialMedia(), entry));
    this.cv.skills = value.skills.map((entry: Skill) => Object.assign(new Skill(), entry));
    if (this.pdfValidationError && this.hasValidPdfInput()) {
      this.pdfValidationError = false;
    }
    if (this.cv.info.language !== value.language) {
      this.changelanguage(value.language);
    }
  }

  private hasValidPdfInput(): boolean {
    const sections = ['experiences', 'educations', 'socialMedias', 'skills'];
    return this.cvForm.valid && sections.every(section => (this.cvForm.get(section) as FormArray).length > 0);
  }

  // CHANGE LANGUAGE
  public changelanguage(language: enumLanguage) {
    this.cv.info.language = language;
    this.cvForm?.get('language')?.setValue(language, { emitEvent: false });
    this.localize.current = language;
    this.document.documentElement.lang = language;
  }

  // FORM CONTROL HELPERS
  public control(name: string): FormControl {
    return this.cvForm.get(name) as FormControl;
  }

  public entryControl(section: string, index: number, field: string): FormControl {
    return (this.cvForm.get(section) as FormArray).at(index).get(field) as FormControl;
  }

  // ACTION BUTTONS
  resetCv() {
    this.cv = new Cv();
    this.pdfValidationError = false;
    this.initializeForm();
    this.changelanguage(this.cv.info.language);
  }

  exportCv() {
    const filename = "cvmaker_" + this.datepipe.transform(new Date(), 'yyyyMMdd_HHmmss' ) + ".json";
    const dataURI = "data:text/plain;base64," + encodeBase64(JSON.stringify(this.cv));
    saveAs(dataURI, filename);
  }

  importCv(event?: Event) {
    if (!event) {
      this.uploader().nativeElement.click();
      return;
    }

    const input = event?.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!input || !file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedCv = this.normalizeCv(JSON.parse(reader.result as string));
        this.cv = importedCv;
        this.initializeForm();
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

  async createPdf() {
    this.cvForm.markAllAsTouched();
    if (!this.hasValidPdfInput()) {
      this.pdfValidationError = true;
      return;
    }

    this.pdfValidationError = false;
    const { pdfCreator } = await import('./pdf/pdfCreator');
    pdfCreator.generatePDF(this.cv);
  }

  setAvatar(image: string) {
    this.cvForm.get('avatar')?.setValue(image);
  }

  // WORK EXPERIENCE
  addExperience() {
    (this.cvForm.get('experiences') as FormArray).push(this.createEntryGroup(new Experience()));
  }

  removeExperience(key: number) {
    (this.cvForm.get('experiences') as FormArray).removeAt(key);
  }

  // EDUCATION
  addEducation() {
    (this.cvForm.get('educations') as FormArray).push(this.createEntryGroup(new Education()));
  }

  removeEducation(key: number) {
    (this.cvForm.get('educations') as FormArray).removeAt(key);
  }

  // SOCIAL MEDIA
  addSocialMedia() {
    (this.cvForm.get('socialMedias') as FormArray).push(this.createEntryGroup(new SocialMedia()));
  }

  removeSocialMedia(key: number) {
    (this.cvForm.get('socialMedias') as FormArray).removeAt(key);
  }

  // SKILLS
  addSkill() {
    (this.cvForm.get('skills') as FormArray).push(this.createEntryGroup(new Skill()));
  }

  removeSkill(key: number) {
    (this.cvForm.get('skills') as FormArray).removeAt(key);
  }

  // NORMALIZE CV DATA
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
    cv.person.birthDate = this.normalizeDate(this.readString(person, 'birthDate'), 'dd-MM-yyyy');

    cv.experiences = this.normalizeEntries(source['experiences'], () => new Experience(), [
      'function', 'employer', 'startDate', 'endDate', 'city', 'description'
    ], 'MMM yyyy');
    cv.educations = this.normalizeEntries(source['educations'], () => new Education(), [
      'school', 'study', 'startDate', 'endDate', 'city', 'description'
    ], 'yyyy');
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

  private normalizeDate(value: string, format: string): string {
    if (!/^\d{4}-\d{2}(?:-\d{2}(?:T.*)?)?$/.test(value)) {
      return value;
    }
    const dateValue = value.length === 7 ? `${value}-01` : value.slice(0, 10);
    return this.datepipe.transform(dateValue, format) ?? '';
  }

  private normalizeEntries<T extends object>(value: unknown, create: () => T, fields: string[], dateFormat?: string): T[] {
    if (!Array.isArray(value)) {
      throw new Error('Invalid CV section');
    }

    return value.map(item => {
      const source = this.asRecord(item);
      const entry = create();
      for (const field of fields) {
        let fieldValue = this.readString(source, field);
        if (dateFormat && (field === 'startDate' || field === 'endDate')) {
          fieldValue = this.normalizeDate(fieldValue, dateFormat);
        }
        Object.assign(entry, { [field]: fieldValue });
      }
      return entry;
    });
  }


}
