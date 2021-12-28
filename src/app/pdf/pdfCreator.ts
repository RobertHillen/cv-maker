import { Cv } from "../models/cv";
import { Experience } from "../models/experience";
import { Education } from '../models/education';
import { Person } from "../models/person";
import { Localization } from '../models/localization';

import DutchJson from '../../assets/dutch.json';
import EnglishJson from '../../assets/english.json';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { enumLanguage } from '../enums/enumLanguage';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PdfCreator {
  private static _instance = new PdfCreator();

  static get instance() {
    return this._instance;
  }

  private getDocumentDefinition(cv: Cv) {
    const sv: Localization[] = cv.info.language === enumLanguage.dutch ? DutchJson : EnglishJson;

    return {
      pageSize: 'A4',
      info: {
        title: 'Curriculum Vitae',
        author: 'Robert Hillen',
        subject: 'CV dynamically created with CV Maker by Robert Hillen'
      },
      footer: function (currentPage, pageCount) {
        return {
          text: sv[0].value + currentPage + sv[1].value + pageCount,
          style: 'footer'
        }
      },
      content: [
        {
          layout: 'noBorders',
          table: {
            widths: ['70%', 'auto'],
            body: [
              [{
                text: this.getFullName(cv.person),
                style: 'persName'
              },
              {
                rowSpan: 2,
                image: cv.info.avatar,
                width: 100,
              }],
              [{
                text: cv.info.title,
                style: 'persTitle'
              },
              {
                text: ''
              }],
            ]
          }
        },
        this.getPersonalAndSocialMedias(cv, sv),
        {
          text: sv[2].value,
          style: 'parHeader'
        },
        this.getExperience(cv.experiences),
        {
          text: this.getFullName(cv.person),
          style: 'persName',
          pageBreak: 'before'
        },
        {
          text: cv.info.title,
          style: 'persTitle'
        },
        {
          text: sv[3].value,
          style: 'parHeader'
        },
        this.getEducation(cv.educations),
        {
          text: sv[4].value,
          style: 'parHeader'
        },
        {
          columns : [
            {
              ul : [
                ...cv.skills.filter((value, index) => index % 3 === 0).map(s => s.ability)
              ]
            },
            {
              ul : [
                ...cv.skills.filter((value, index) => index % 3 === 1).map(s => s.ability)
              ]
            },
            {
              ul : [
                ...cv.skills.filter((value, index) => index % 3 === 2).map(s => s.ability)
              ]
            }
          ]
        },
      ],
      styles: {
        footer: {
          color: '#4682B4',
          alignment: 'center',
          margin: [0, 0, 0, 5]
        },
        link: {
          decoration: 'underline',
          color: '#4682B4'
        },
        persName: {
          fontSize: 16,
          bold: true,
          color: '#000080'
        },
        persTitle: {
          fontSize: 12,
          italics: true,
          color: '#000000',
          margin: [0, 0, 0, 10]
        },
        parHeader: {
          fontSize: 14,
          bold: true,
          color: '#000080'
        },
        parDescription: {
          alignment: 'justify',
          margin: [10, 0, 0, 10]
        },
        parTitle: {
          fontSize: 12,
          bold: true
        },
        parPeriod: {
          margin: [10, 0, 0, 0],
          color: '#C0C0C0'
        }
      }
    }
  }

  private getFullName(person: Person) {
    return this.createString([person.firstName.toUpperCase(), person.lastName.toUpperCase()], ' ');
  }

  private createString(array: string[], separator: string = ', ') {
    const checker = [null, undefined];
    return array.filter((item) => !checker.includes(item)).join(separator)
  }

  private getExperience(experiences: Experience[]) {
    const exp = [];

    experiences.forEach(experience => {
      exp.push(
            [{
              text: this.createString([experience.function, experience.employer, experience.city]),
              style: 'parTitle'
            }],
            [{
              text: this.createString([experience.startDate, experience.endDate], ' - '),
              style: 'parPeriod'
            }],
            [{
              text: experience.description,
              style: 'parDescription',
            }]
      );
    });

    return {
      layout: 'noBorders',
      table: {
        widths: ['*'],
        body: [
          ...exp
        ]
      }
    };
  }

  private getPersonalAndSocialMedias(cv: Cv, sv: Localization[]) {
    const pas = [];

    cv.socialMedias.forEach(socialMedia => {
      pas.push(
        [{
          text: '',
        },
        {
          text:socialMedia.label,
          link: socialMedia.link,
          style: 'link'
         }],
      );
    });

    return {
      layout: 'noBorders',
        table: {
          widths: ['70%', 'auto'],
          body: [
            [{
              text: sv[6].value,
              style: 'parHeader',
            },
            {
              text: sv[5].value,
              style: 'parHeader'
            }],
            [{
              rowSpan: 5 + cv.socialMedias.length,
              text: cv.info.profile,
              style: 'parDescription',
            },
            {
              text: ''
            }],
            [{
              text: ''
            },
            {
              text: cv.person.address
            }],
            [{
              text: ''
            },
            {
              text: this.createString([cv.person.zipCode, cv.person.city.toUpperCase()], ' ')
            }],
            [{
              text: ''
            },
            {
              text: cv.person.phone,
            }],
            [{
              text: '',
            },
            {
              text: cv.person.email,
              link: 'mailto:' + cv.person.email,
              style: 'link'
            }],
            ...pas
          ]
        }
      }
  }

  private getEducation(educations: Education[]) {
    const edu = [];

    educations.forEach(education => {
      edu.push(
            [{
              text: this.createString([education.school, education.study, education.city]),
              style: 'parTitle'
            }],
            [{
              text: this.createString([education.startDate, education.endDate], ' - '),
              style: 'parPeriod'
            }],
            [{
              text: education.description,
              style: 'parDescription',
            }]
      );
    });

    return {
      layout: 'noBorders',
      table: {
        widths: ['*'],
        body: [
          ...edu
        ]
      }
    };
  }

  generatePDF(cv: Cv, action = 'open') {
    const docDefinition = this.getDocumentDefinition(cv);

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if(action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
  }
}

export const pdfCreator = PdfCreator.instance;
