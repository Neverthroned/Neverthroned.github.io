const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
const hue1Input = document.getElementById('hue1');
const hue2Input = document.getElementById('hue2');
const saturationInput = document.getElementById('saturation');
const gammaInput = document.getElementById('gamma');
const resetBtn = document.getElementById('reset');

canvas.width = 32;
canvas.height = 32;

function hsvToRgb(h,s,v){
  h = ((h % 360) + 360) % 360;
  let c = v * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = v - c;
  let r=0,g=0,b=0;
  if(h<60){r=c;g=x;b=0;} else if(h<120){r=x;g=c;b=0;}
  else if(h<180){r=0;g=c;b=x;} else if(h<240){r=0;g=x;b=c;}
  else if(h<300){r=x;g=0;b=c;} else {r=c;g=0;b=x;}
  return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
}

function applyGamma(value, gamma){
  return Math.pow(value, gamma);
}

function renderPalette(){
  const hsv1 = hexToHsv(hue1Input.value);
  const hsv2 = hexToHsv(hue2Input.value);
  const satFactor = parseFloat(saturationInput.value);
  const gamma = parseFloat(gammaInput.value);

  const img = ctx.createImageData(canvas.width, canvas.height);

  for(let y=0;y<canvas.height;y++){
    let ny = y / (canvas.height-1);

    for(let x=0;x<canvas.width;x++){
      const t = x / (canvas.width-1);
      // Interpolate HSV
      const hue = hsv1.h*(1-t) + hsv2.h*t;
      const sat = (hsv1.s*(1-t) + hsv2.s*t) * satFactor;
      const val = hsv1.v*(1-t) + hsv2.v*t;

      const [rHue,gHue,bHue] = hsvToRgb(hue, sat, 1);

      // Mix white -> hue -> black with gamma applied to interpolation factor
      let r, g, b;
      if(ny < 0.5){
        let f = applyGamma(ny*2, gamma);
        r = 255*(1-f) + rHue*f*val;
        g = 255*(1-f) + gHue*f*val;
        b = 255*(1-f) + bHue*f*val;
      } else {
        let f = applyGamma((ny-0.5)*2, gamma);
        r = rHue*(1-f)*val;
        g = gHue*(1-f)*val;
        b = bHue*(1-f)*val;
      }

      const i = (y*canvas.width + x)*4;
      img.data[i+0] = Math.round(r);
      img.data[i+1] = Math.round(g);
      img.data[i+2] = Math.round(b);
      img.data[i+3] = 255;
    }
  }
  ctx.putImageData(img,0,0);
}

// Convert hex to HSV
function hexToHsv(hex){
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0, v=max;
  let d = max - min;
  s = max === 0 ? 0 : d/max;
  if(d === 0) h = 0;
  else if(max===r) h = 60*((g-b)/d);
  else if(max===g) h = 60*((b-r)/d + 2);
  else h = 60*((r-g)/d + 4);
  return {h: (h+360)%360, s: s, v: v};
}

// Event listeners
[hue1Input,hue2Input,saturationInput,gammaInput].forEach(el=>{
  el.addEventListener('input',renderPalette);
});

resetBtn.addEventListener('click',()=>{
  hue1Input.value = "#ff0000";
  hue2Input.value = "#0000ff";
  saturationInput.value = 1;
  gammaInput.value = 1;
  renderPalette();
});

// Initial render
renderPalette();