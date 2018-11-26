import jsPDF from 'jspdf'
import autotable from 'jspdf-autotable'
import { escudo } from './dataURLimages'
import { fechaParaDocumentos } from '@/utils/dateUtils'
import html2canvas from 'html2canvas'


const createPDF = function (circular) {

  let pdf = new jsPDF('p', 'mm', [215.9, 279.4])

  pdf.setFontType('normal')
  pdf.setFontSize(12)

  pdf.text(170, 70, 'No.')

  pdf.setFontType('bold')
  pdf.setFontSize(14)
  //idCircular
  pdf.text(178, 70, calcularNumeracion(circular.circ_id))

  // fecha
  pdf.setFontSize(10)
  pdf.setFontType('normal')
  pdf.rect(10, 73, 195, 10)
  pdf.setFontType('normal')
  pdf.text(15, 79, 'FECHA:')

  pdf.setFontType('bold')
  pdf.text(33, 79, fechaParaDocumentos(circular.circ_fecha))
  pdf.setFontType('normal')
  pdf.lineHeightProportion = 2;
  let yPos = addElem(pdf, 'PARA: ' + circular.entidad.enti_nombre, 90)
  yPos = addElem(pdf, 'DE: ' + circular.area.area_nombre, yPos)
  yPos = addElem(pdf, 'ASUNTO: ' + circular.circ_asunto, yPos)
  addCuerpo(pdf, circular.circ_contenido, yPos, circular)
  addLinesCuerpo(pdf, yPos - 7)
  // addFirma(pdf, circular)


  headerFooterFormatting(pdf)
  pdf.save('circular' + circular.circ_id + '_' + new Date().getTime() + '.pdf')
}

const addElem = function (pdf, text, yPos) {

  // let test = 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum'
  let lines = pdf.splitTextToSize(
    text, 185,
    {
      'fontSize': 10,
      'fontStyle': 'bold',
      'fontName': 'Arial',
      'align': 'justify'
    })
  let lineSize = lines.length
  let addRectSize = (lineSize > 1 ? 3.7 * lineSize : 1)
  pdf.rect(10, yPos - 7, 195, 10 + addRectSize)
  pdf.text(text, 15, yPos, { maxWidth: 185, align: "justify" })

  return 10 + addRectSize + yPos
}

const addCuerpo = function (pdf, HTML, yPos, circular) {

  let tmp = document.createElement("div")

  document.body.append(tmp)

  tmp.innerHTML = '<div style="color:black">' + HTML + '<br><br><br><br><br><br>'
    + '<p style="text-align: left;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><strong>'
    + circular.responsable.resp_nombre
    + '</strong></span></p>'
    + '<p style="text-align: left;"><span style="font-size: 8pt; font-family: arial, helvetica, sans-serif;">'
    + circular.area.area_nombre + '</span></p></div>'

  let margins = {
    top: 70,
    bottom: 10,
    left: 30,
    width: 550
  }
  pdf.fromHTML(tmp,
    15,
    yPos - 5,
    {
      'width': 180
    }, function (dispose) {

    },
    margins)

  tmp.parentNode.removeChild(tmp)
}

const addFirma = function (pdf, circular) {
  let tmp = document.createElement("div")

  document.body.append(tmp)

  tmp.innerHTML = '<div style="color:black">'
    + '<p style="text-align: left;"><span style="font-size: 12pt; font-family: arial, helvetica, sans-serif;"><strong>'
    + circular.responsable.resp_nombre
    + '</strong></span></p>'
    + '<p style="text-align: left;"><span style="font-size: 8pt; font-family: arial, helvetica, sans-serif;">'
    + circular.area.area_nombre + '</span></p></div>'

  let margins = {
    top: 70,
    bottom: 10,
    left: 30,
    width: 550
  }
  pdf.fromHTML(tmp,
    15,
    null,
    {
      'width': 180
    }, function (dispose) {

    },
    margins)

  tmp.parentNode.removeChild(tmp)
}

const addLinesCuerpo = function (pdf, yPos) {
  let totalPages = pdf.internal.getNumberOfPages();

  for (let i = totalPages; i >= 1; i--) {

    pdf.setPage(i)

    if (i > 1) {
      pdf.line(10, 68, 10, 263)
      pdf.line(205, 68, 205, 263)
      pdf.line(10, 263, 205, 263)
      pdf.line(10, 68, 205, 68)
    } else {
      pdf.line(10, yPos, 10, 263)
      pdf.line(205, yPos, 205, 263)
      pdf.line(10, 263, 205, 263)
      pdf.line(10, yPos, 205, yPos)
    }

  }
}

const headerFooterFormatting = function (pdf) {
  let totalPages = pdf.internal.getNumberOfPages();

  for (let i = totalPages; i >= 1; i--) { //make this page, the current page we are currently working on.
    pdf.setPage(i);

    setHeader(pdf);

    addFooter(pdf, i, totalPages);

  }
}

const addFooter = function (pdf, index, totalPages) {
  pdf.setFontSize(8)
  pdf.setFontType('normal')
  pdf.text('Página ' + index + ' de ' + totalPages, 185, 270)
}


const setHeader = function (pdf) {
  let pageCount = pdf.internal.getNumberOfPages()
  for (let i = 0; i < pageCount; i++) {
    pdf.setPage(i)

    // IMAGEN
    pdf.rect(10, 10, 55, 30)
    pdf.addImage(escudo, 'JPEG', 17.5, 10, 40, 30)

    // SISTEMA DE GESTIÓN DE LA CALIDAD Y SISTEMA DE CONTROL INTERN
    pdf.rect(65, 10, 85, 30)
    pdf.setFontSize(10)
    pdf.text(72.5, 15, 'SISTEMA DE GESTIÓN DE LA CALIDAD Y')
    pdf.text(78.5, 20, 'SISTEMA DE CONTROL INTERNO')

    pdf.setFontSize(12)

    // CIRCULAR
    pdf.setFontType('bold')
    pdf.text(96, 30, 'CIRCULAR')

    pdf.setFontSize(10)

    // VERSION
    pdf.rect(150, 10, 55, 15)
    pdf.text(155, 18, 'Versión: 1')

    // FECHA
    pdf.rect(150, 25, 55, 15)
    pdf.text(155, 33, 'FECHA: Junio 2011')

    // APOYO A LA GESTION INSTITUCIONAL
    pdf.setFontType('normal')
    pdf.rect(10, 40, 55, 15)
    pdf.text(18, 46, 'APOYO A LA GESTIÓN')
    pdf.text(23, 51, 'INSTITUCIONAL')

    // GESTION ADMINISTRATIVA
    pdf.rect(65, 40, 85, 15)
    pdf.text(85, 48, 'GESTIÓN ADMINISTRATIVA')

    // GESTION DOCUMENTAL ARCHIVO Y CORRESPONDECIA
    pdf.rect(150, 40, 55, 15)
    pdf.text(155.5, 44, 'GESTIÓN DOCUMENTAL,')
    pdf.text(166, 48.5, 'ARCHIVO Y')
    pdf.text(156, 53, 'CORRESPONDENCIA')

    pdf.setFontType('bold')

    //MACROPROCESO
    pdf.rect(10, 55, 55, 7)
    pdf.text(23.5, 59, 'Macro proceso')

    // PROCESO
    pdf.rect(65, 55, 85, 7)
    pdf.text(103, 59, 'Proceso')

    // SUBPROCESO
    pdf.rect(150, 55, 55, 7)
    pdf.text(166, 59, 'Subproceso')


  }
}

export const calcularNumeracion = function (circ_id) {
  // si desea aumentar el concatenador de de CEROS, aumente el valor de la variable size
  let size = 6
  let ceros = ''
  for (let i = 0; i < size - circ_id.toString().length; i++) {
    ceros += '0'
  }

  return ceros + circ_id + ''
}

export default createPDF