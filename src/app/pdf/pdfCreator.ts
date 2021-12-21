import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Cv } from "../models/cv";
import { Experience } from "../models/experience";
import { Education } from '../models/education';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export class PdfCreator {
  private static _instance = new PdfCreator();

  static get instance() {
    return this._instance;
  }

  constructor() {
    console.log('pdfCreator.constructor');
  }

  private getDocumentDefinition(cv: Cv) {
    console.log('pdfCreator.getDocumentDefinition');

    return {
      pageSize: 'A4',
      info: {
        title: 'Curriculum Vitae',
        author: 'Robert Hillen',
        subject: 'CV dynamiccaly created by R.W. Hillen'
      },
      footer: function (currentPage, pageCount) {
        return {
          text: "Pagina " + currentPage + ' van ' + pageCount,
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
                text: cv.person.firstName.toUpperCase() + ' '+ cv.person.lastName.toUpperCase(),
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
        {
          layout: 'noBorders',
          table: {
            widths: ['70%', 'auto'],
            body: [
              [{
                text: 'Profiel',
                style: 'parHeader',
              },
              {
                text: 'Personalia',
                style: 'parHeader'
              }],
              [{
                rowSpan: 5,
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
                text: cv.person.zipCode + ' ' + cv.person.city.toUpperCase()
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
               }]
            ]
          }
        },
        {
          text: 'Werkervaring',
          style: 'parHeader'
        },
        this.getExperience(cv.experiences),
        {
          text: 'Opleiding',
          style: 'parHeader',
          pageBreak: 'before'
        },
        this.getEducation(cv.educations),
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
          color: '#000000'
        },
        parHeader: {
          fontSize: 14,
          bold: true,
          color: '#000080'
        },
        parDescription: {
          alignment: 'justify',
          margin: [0, 0, 0, 10]
        },
        parTitle: {
          fontSize: 12,
          bold: true
        },
        parPeriod: {
          color: '#C0C0C0'
        }
      }
    }
  }

  private getExperience(experiences: Experience[]) {
    const exs = [];

    experiences.forEach(experience => {
      exs.push(
            [{
              text: experience.function + ', ' + experience.employer + ', ' + experience.city,
              style: 'parTitle'
            }],
            [{
              text: experience.startDate + ' - ' + experience.endDate,
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
          ...exs
        ]
      }
    };
  }

  private getEducation(educations: Education[]) {
    const exs = [];

    educations.forEach(education => {
      exs.push(
            [{
              text: education.school + ', ' + education.study + ', ' + education.city,
              style: 'parTitle'
            }],
            [{
              text: education.startDate + ' - ' + education.endDate,
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
          ...exs
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
