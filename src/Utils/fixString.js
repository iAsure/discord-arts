function fixString(ARG, ctx, fuente, tamaño, cantidad) {
  const arrayLetras = ARG.split('');

  let texto = '';
  let textoCompleto = '';

  for (let i = 0; i < ARG.length; i++) {
    texto = arrayLetras.join('');

    ctx.font = `${tamaño}px ${fuente}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';

    if (ctx.measureText(texto).width >= cantidad) arrayLetras.pop();
    if (ctx.measureText(texto).width <= cantidad) {
      textoCompleto = arrayLetras.join('');
      break;
    }
  }

  return textoCompleto;
}

function lengthString(ARG, ctx, fuente, tamaño) {
  ctx.font = `${tamaño}px ${fuente}`;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';

  return ctx.measureText(ARG).width;
}

module.exports = { fixString, lengthString }
