import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Product {
  name: string;
  price: number;
  qty: number;
}
class Invoice {
  customerName: string;
  address: string;
  contactNo: number;
  email: string;
  products: Product[] = [];
  additionalDetails: string;

  constructor(){
    this.products.push(new Product());
  }
}

export class PdfCreator {
  private static _instance = new PdfCreator();

  invoice = new Invoice();

  constructor() {
    console.log('pdfCreator.constructor');
  }

  static get instance() {
    return this._instance;
  }

  public buildPdf() {
    console.log('pdfCreator.buildPdf');
  }

  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
          text: 'ELECTRONIC SHOP',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]
        }
      }
    };

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();
    }else{
      pdfMake.createPdf(docDefinition).open();
    }
  }
}

export const pdfCreator = PdfCreator.instance;
