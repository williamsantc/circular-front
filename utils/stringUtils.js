export const randomWord = function(limit) {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let generated = false
  // Por lo menos un número, una letra minúscula y una mayúscula
  // Al menos 6 caracteres
  let re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])./
  while (!generated) {
    for (var i = 0; i < limit; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    if (re.test(text)) {
      generated = true
    } else {
      text = ''
    }
  }

  return text
}
