import { Person } from './person';
import { Info } from './info';
import { Experience } from './experience';
import { Education } from './education';
import { SocialMedia } from './socialMedia';
import { Skill } from './skill';

export class Cv {
  info: Info = new Info();
  person: Person = new Person();
  experiences: Experience[] = [];
  educations: Education[] = [];
  socialMedias: SocialMedia[] = [];
  skills: Skill[] = [];
}
