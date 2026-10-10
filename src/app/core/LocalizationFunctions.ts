import { computed, Injectable, signal } from '@angular/core';
import { enumLanguage } from '../enums/enumCv';

import DutchJson from '../../assets/dutch.json';
import EnglishJson from '../../assets/english.json';

@Injectable({
  providedIn: 'root',
})
export class LocalizationFunctions {
  private readonly dutch = new Map<number | string, string>(DutchJson.map(entry => [entry.id, entry.value]));
  private readonly english = new Map<number | string, string>(EnglishJson.map(entry => [entry.id, entry.value]));
  private readonly language = signal(enumLanguage.dutch);
  private readonly values = computed(() => this.language() === enumLanguage.dutch ? this.dutch : this.english);

  public set current(value: enumLanguage) {
    this.language.set(value);
  }

  public translate(id: string): string {
    return this.values().get(id) ?? '';
  }
}
