import Vue from 'vue'
import FestivosColombia from '@/plugins/festivos-colombia.js'

export const validarForm = {
  methods: {
    isDiaHabil: function (fecha) {
      let diasFestivos = FestivosColombia.cargarFestivos(
        new Date().getFullYear() + ''
      )
      let res = true
        
      for (let festivo in diasFestivos) {
        if (
          fecha.getTime() ===
          new Date(
            parseInt(diasFestivos[festivo].split('-')[0]),
            parseInt(diasFestivos[festivo].split('-')[1]) - 1,
            parseInt(diasFestivos[festivo].split('-')[2])
          ).getTime()
        ) {
          res = false
          break
        }
      }

      if (fecha.getUTCDay() === 6 || fecha.getUTCDay() === 0) {
        res = false
      }

      return res
    },
    validarCantidadCaracteres: function (event, campo, limite) {
      if (
        campo.length >= limite &&
        event.keyCode !== 8 &&
        event.keyCode !== 46 &&
        event.keyCode !== 37 &&
        event.keyCode !== 38 &&
        event.keyCode !== 39 &&
        event.keyCode !== 40 &&
        event.keyCode !== 9
      ) {
        event.preventDefault()
      }
    },
    validarKeyNumero: function (evt) {
      var controlKeys =
        evt.keyCode === 8 ||
        evt.keyCode === 46 ||
        evt.keyCode === 37 ||
        evt.keyCode === 38 ||
        evt.keyCode === 39 ||
        evt.keyCode === 40 ||
        evt.keyCode === 9
      if (
        !controlKeys &&
        (parseInt(evt.charCode) < 48 || parseInt(evt.charCode) > 57)
      ) {
        evt.preventDefault()
      }
    },
    calcularDiferenciaDiasHabiles(fechaDesde, fechaHasta) {
      if (!fechaDesde || !fechaHasta) {
        return 0
      }

      if (fechaHasta < fechaDesde) {
        return 0
      }

      let diasFestivos = FestivosColombia.cargarFestivos(
        new Date().getFullYear() + ''
      )
      let timeDiff = Math.abs(fechaDesde.getTime() - fechaHasta.getTime())
      let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
      let diasNoHabiles = 0
      for (let i = 1; i <= diffDays; i++) {
        let fechaString = FestivosColombia.formatDate(
          FestivosColombia.addDays(fechaDesde, i)
        )
        let pivoteFecha = new Date(
          parseInt(fechaString.split('-')[0]),
          parseInt(fechaString.split('-')[1]) - 1,
          parseInt(fechaString.split('-')[2])
        )
        for (let festivo in diasFestivos) {
          if (
            pivoteFecha.getTime() ===
            new Date(
              parseInt(diasFestivos[festivo].split('-')[0]),
              parseInt(diasFestivos[festivo].split('-')[1]) - 1,
              parseInt(diasFestivos[festivo].split('-')[2])
            ).getTime()
          ) {
            diasNoHabiles++
          }
        }
        if (pivoteFecha.getUTCDay() === 6 || pivoteFecha.getUTCDay() === 0) {
          diasNoHabiles++
        }
      }

      return diffDays - diasNoHabiles
    },
    validarCampos: function (formData, indexDinamico) {
      var form = formData.form
      var config = formData.config
      for (var values in config) {
        if (
          !config[values].required &&
          !config[values].hasOwnProperty('validar')
        ) {
          continue
        }
        let selector = config[values].hasOwnProperty('ref')
          ? config[values].ref
          : values
        let ref =
          indexDinamico !== undefined
            ? this.$refs[selector][indexDinamico]
            : this.$refs[selector]
        switch (config[values].type) {
          case 'String':
            if (
              form[values] === '' &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'Campos imcompletos, verifique: ' + config[values].msg
              )
              return false
            } else if (
              config[values].hasOwnProperty('limite') &&
              form[values].length > config[values].limite
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'Limite de caracteres en el campo: ' +
                config[values].msg +
                ' superado (máximo: ' +
                config[values].limite +
                ')'
              )
              return false
            }

            break

          case 'Number':
            if (
              form[values] === '' &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'Campos imcompletos, verifique el campo: ' + config[values].msg
              )
              return false
            }

            if (isNaN(form[values])) {
              this.sendFocus(ref)
              this.$toastr.error(
                'El campo solo permite números, verifique: ' +
                config[values].msg
              )
              return false
            }
            if (
              config[values].hasOwnProperty('mayorQue') &&
              form[values] <= config[values].mayorQue
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'El número debe ser mayor que ' +
                config[values].mayorQue +
                ', verifique: ' +
                config[values].msg
              )
              return false
            }

            if (
              config[values].hasOwnProperty('menorQue') &&
              form[values] >= config[values].menorQue
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'El número debe ser menor que' +
                config[values].menorQue +
                ', verifique: ' +
                config[values].msg
              )
              return false
            }

            break
          case 'Email':
            if (
              form[values] === '' &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'Campos imcompletos, verifique el campo: ' + config[values].msg
              )
              return false
            }

            if (!this.validateEmail(form[values])) {
              this.sendFocus(ref)
              this.$toastr.error(config[values].msg + ' Invalido')
              return false
            }

            break
          case 'Object':
            if (config[values].goThrough) {
              var obj = {
                form: form[values],
                config: config[values].innerData
              }
              if (!this.validarCampos(obj)) {
                return false
              }
            } else if (
              form[values].value === '' &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.sendFocus(ref.$el.querySelector('input'))
              this.$toastr.error(
                'Campos imcompletos, verifique el campo: ' + config[values].msg
              )
              return false
            }
            break
          case 'Array':
            if (
              Object.keys(form[values]).length <= 0 &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.$toastr.error(
                'No hay elementos en la lista: ' + config[values].msg
              )
              return false
            }
            break
          case 'Date':
            if (
              (form[values] === '' || form[values] === null) &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'Campos imcompletos, verifique el campo: ' + config[values].msg
              )
              return false
            }

            let diasFestivos = FestivosColombia.cargarFestivos(
              new Date().getFullYear() + ''
            )

            let date = new Date(
              parseInt(form[values].split('-')[0]),
              parseInt(form[values].split('-')[1]) - 1,
              parseInt(form[values].split('-')[2])
            )
            if (
              config[values].hasOwnProperty('difference') &&
              config[values].difference
            ) {
              let nextDate = new Date(
                parseInt(config[values].nextDate.split('-')[0]),
                parseInt(config[values].nextDate.split('-')[1]) - 1,
                parseInt(config[values].nextDate.split('-')[2])
              )
              let diasMaximo = config[values].difference

              if (
                this.calcularDiferenciaDiasHabiles(date, nextDate) > diasMaximo
              ) {
                this.sendFocus(ref)
                this.$toastr.error(
                  'La diferencia entre las fecha debe ser de ' +
                  config[values].difference +
                  ' día(s) Hábiles, verifique el campo: ' +
                  config[values].msg
                )
                return false
              }
            }

            if (
              config[values].hasOwnProperty('soloHabiles') &&
              config[values].soloHabiles
            ) {
              if (!this.isDiaHabil(date)) {
                this.sendFocus(ref)
                this.$toastr.error('Solo se permiten días hábiles.')
                return false
              }
            }

            if (
              config[values].hasOwnProperty('lowerThan') &&
              new Date(config[values].lowerThan) < date
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'La fecha no es válida, verifique el campo: ' +
                config[values].msg
              )
              return false
            }

            if (
              config[values].hasOwnProperty('greaterThan') &&
              new Date(config[values].greaterThan) > date
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'La fecha no es válida, verifique el campo: ' +
                config[values].msg
              )
              return false
            }
            break
          case 'Time':
            if (
              form[values] === '' &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.sendFocus(ref)
              this.$toastr.error(
                'Campos imcompletos, verifique el campo: ' + config[values].msg
              )
              return false
            }

            if (config[values].hasOwnProperty('greaterThan')) {
              let partsHour = form[values].split(':')
              let endHour = new Date()
              endHour.setHours(partsHour[0], partsHour[1], 0)
              let partsConfig = config[values].greaterThan.split(':')
              let startHour = new Date()
              startHour.setHours(partsConfig[0], partsConfig[1], 0)
              let partsGreater = config[values].greaterThan.split(':')
              let greaterShow =
                (parseInt(partsGreater[0]) < 12
                  ? partsGreater[0]
                  : parseInt(partsGreater[0]) - 12) +
                ':' +
                partsGreater[1] +
                (parseInt(partsGreater[0]) < 12 ? ' AM' : ' PM')
              if (startHour > endHour) {
                this.sendFocus(ref)
                this.$toastr.error(
                  'La hora es inferior a las ' +
                  greaterShow +
                  ', verifique el campo: ' +
                  config[values].msg
                )
                return false
              }
            }
            break
          case 'CheckBox':
            if (!form[values] && !config[values].hasOwnProperty('validar')) {
              this.sendFocus(ref)
              this.$toastr.error(
                'Campos imcompletos, verifique el campo: ' + config[values].msg
              )
              return false
            }
            break
          case 'Radio':
            if (
              form[values] === '' &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.sendFocus(ref.$el.querySelector('input'))
              this.$toastr.error(
                'Campos imcompletos, verifique: ' + config[values].msg
              )
              return false
            }
            break
          case 'Select':
            if (
              form[values] === '' &&
              !config[values].hasOwnProperty('validar')
            ) {
              this.sendFocus(ref.$el)
              this.$toastr.error(
                'Campos imcompletos, verifique: ' + config[values].msg
              )
              return false
            }

            if (config[values].hasOwnProperty('lista')) {
              let checkModificacion = false
              config[values].lista.forEach(element => {
                if (element.value === form[values]) {
                  checkModificacion = true
                }
              })

              if (!checkModificacion) {
                this.sendFocus(ref.$el)
                this.$toastr.error(
                  'ERROR FATAL: Alteración del HTML el valor ' +
                  form[values] +
                  ' no existe, verifique: ' +
                  config[values].msg
                )
                return false
              }
            }

            break

          default:
            console.log(config[values].type)
            break
        }
      }
      return true
    },
    validateEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    },
    sendFocus(element) {
      Vue.nextTick(() => {
        element.focus()
      })
    }
  }
}
