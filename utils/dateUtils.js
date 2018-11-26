
export const fechaParaDocumentos = function (fecha) {
  let meses = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE'
  ]

  let dia = fecha.split('-')[2]
  let mes = fecha.split('-')[1]
  let anio = fecha.split('-')[0]

  return dia + ' DE ' + meses[mes  - 1] + ' DE ' + anio
}