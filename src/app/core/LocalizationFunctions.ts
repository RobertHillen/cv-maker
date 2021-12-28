import { Injectable } from '@angular/core';

import { Localization } from "src/app/models/localization";
import { enumLanguage } from '../enums/enumLanguage';

import DutchJson from '../../assets/dutch.json';
import EnglishJson from '../../assets/english.json';

@Injectable({
  providedIn: 'root',
})
export class LocalizationFunctions {

  private dutch: Localization[] = DutchJson;
  private english: Localization[] = EnglishJson;

  private language: enumLanguage;

  constructor() {
    this.language = enumLanguage.dutch;
  }

  public set current(value: enumLanguage) {
    this.language = value;
  }

  public getValue(id: number) {
    switch (this.language) {
      case enumLanguage.dutch:
        return this.dutch[id].value;
      case enumLanguage.english:
        return this.english[id].value;
      default:
        break;
    }
  }
}
