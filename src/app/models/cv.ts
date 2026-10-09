import { Person, Info, Experience, Education, SocialMedia, Skill } from './modelCv';
import { enumLanguage } from '../enums/enumCv';

export class Cv {
  info: Info;
  person: Person;
  experiences: Experience[] = [];
  educations: Education[] = [];
  socialMedias: SocialMedia[] = [];
  skills: Skill[] = [];

  constructor() {
    this.info = new Info();
    this.person = new Person();
    this.experiences.push(new Experience());
    this.educations.push(new Education());
    this.socialMedias.push(new SocialMedia());
    this.skills.push(new Skill());

    this.info.language = enumLanguage.dutch;
  }
}
