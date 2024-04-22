function playSystemBeep() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  // تولید موج سینوسی برای بیپ
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(500, audioCtx.currentTime); // فرکانس بیپ
  oscillator.connect(audioCtx.destination);
  
  // زمان پخش بیپ
  oscillator.start();
  setTimeout(() => oscillator.stop(), 100);
}

document.getElementById('mix-button').addEventListener('click', mixColors);
document.getElementById('random-button').addEventListener('click', randomColor);
document.getElementById('reset-button').addEventListener('click', resetColors);
document.getElementById('copy-button').addEventListener('click', copyColor);

function mixColors() {
  const color1 = document.getElementById('color1').value;
  const color2 = document.getElementById('color2').value;
  const mixedColor = blendColors(color1, color2);
  document.getElementById('color-box').style.backgroundColor = mixedColor;
  document.getElementById('hex-value').innerText = mixedColor.toUpperCase();
  
  const rgbValue = hexToRgb(mixedColor);
  document.getElementById('rgb-value').innerText = `RGB(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`;

  const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b);
  document.getElementById('hsl-value').innerText = `HSL(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`;

  const gradient = `linear-gradient(to right, ${color1}, ${color2})`;
  document.getElementById('color-gradient').style.background = gradient;

  playSystemBeep(); // اینجا صدا را فراخوانی کنید
}

function blendColors(color1, color2) {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const mixedR = Math.floor((r1 + r2) / 2);
  const mixedG = Math.floor((g1 + g2) / 2);
  const mixedB = Math.floor((b1 + b2) / 2);

  return `#${componentToHex(mixedR)}${componentToHex(mixedG)}${componentToHex(mixedB)}`;
}

function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function randomColor() {
  const randomColor1 = '#' + Math.floor(Math.random()*16777215).toString(16);
  const randomColor2 = '#' + Math.floor(Math.random()*16777215).toString(16);
  document.getElementById('color1').value = randomColor1;
  document.getElementById('color2').value = randomColor2;
  mixColors();
}

function resetColors() {
  document.getElementById('color1').value = '#000000';
  document.getElementById('color2').value = '#ffffff';
  mixColors();
}

function copyColor() {
  const colorValue = document.getElementById('hex-value').innerText;
  const tempInput = document.createElement('input');
  tempInput.value = colorValue;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  alert('Color copied to clipboard: ' + colorValue);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.substring(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
