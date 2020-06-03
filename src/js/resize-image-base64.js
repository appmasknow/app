module.exports = function(base64, maxWidth, maxHeight) {
  // Tamanho máximo para miniatura
  if(typeof(maxWidth) === 'undefined')  maxWidth = 500;
  if(typeof(maxHeight) === 'undefined')  maxHeight = 500;

  // Crie e inicialize duas telas
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  var canvasCopy = document.createElement("canvas");
  let copyContext = canvasCopy.getContext("2d");

  // Criar imagem original
  let img = new Image();
  img.src = base64;

  // Determinar nova proporção com base no tamanho máximo
  let ratio = 1;
  if(img.width > maxWidth)
    ratio = maxWidth / img.width;
  else if (img.height > maxHeight)
    ratio = maxHeight / img.height;

  // Desenhar imagem original na segunda tela
  canvasCopy.width = img.width;
  canvasCopy.height = img.height;
  copyContext.drawImage(img, 0, 0);

  // Copie e redimensione a segunda tela para a primeira tela
  canvas.width = img.width * ratio;
  canvas.height = img.height * ratio;
  ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
  
  return canvas.toDataURL();
};
