import { Person } from './person';
import { Info } from './info';
import { Experience } from './experience';
import { Education } from './education';
import { SocialMedia } from './socialMedia';
import { Skill } from './skill';

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

    // this.debugInfo();
  }

  debugInfo() {
    this.info.title = 'Senior Product Software Engineer';
    this.info.profile = 'Software developer met meer dan 30 jaar ervaring in software ontwikkeling in elke stadium van het proces zoals coderen, testen, debuggen, onderhouden en releasen. Van in de eerste jaren applicaties voor MS-DOS en SCO Unix naar Windows desktop applicaties tot cloud development op dit moment. Er wordt gewerkt onder Azure en Azure DevOps in een Agile omgeving waar ik ook scrum master ben. Visual Studio Code en Visual Studio zijn tools die dagelijks gebruikt worden.';
    this.person.firstName = 'Robert';
    this.person.lastName = 'Hillen';
    this.person.address = 'Romeyn de Hooghestraat 67';
    this.person.zipCode = '7425 PT';
    this.person.city = 'Deventer';
    this.person.country = 'NL';
    this.person.email = 'robert@hilting.nl';
    this.person.phone = '06 46722604';
    this.person.driverLicense = 'AB';
    this.person.nationality = 'Nederlandse';
    this.person.birthCity = 'Amsterdam';
    this.person.birthDate = '29 april 1962';
  }
}
