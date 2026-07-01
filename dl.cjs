const sharp = require("sharp");
const UA = { "User-Agent": "WildlifeDB/1.0 (contact@wildlifedb.local)" };
const items = [
  ["pant1","https://upload.wikimedia.org/wikipedia/commons/d/d2/Myrmecophaga_tridactyla%2C_Pantanal_region%2C_Brazil_%28cropped%29.jpg"],
  ["pant2","https://upload.wikimedia.org/wikipedia/commons/d/de/Myrmecophaga_tridactyla_in_Pantanal.jpg"],
  ["pant3","https://upload.wikimedia.org/wikipedia/commons/1/18/Brazil_Mato_Grosso_Do_Sul_Pantanal_Giant_Ant%C3%A9ater_Grand_Fourmilier_Tamanoir_%2811851618593%29.jpg"],
  ["past","https://upload.wikimedia.org/wikipedia/commons/e/e3/Tamandu%C3%A1-bandeira_com_filhote_em_pastagem.jpg"],
  ["pantaneiro","https://upload.wikimedia.org/wikipedia/commons/9/9c/Tamandu%C3%A1_Bandeira_pantaneiro.JPG"],
  ["formigas","https://upload.wikimedia.org/wikipedia/commons/3/30/Grande_comedor_de_formigas.jpg"],
];
(async()=>{for(const [n,u] of items){try{const r=await fetch(u,{headers:UA});const b=Buffer.from(await r.arrayBuffer());await sharp(b).resize(440).png().toFile(`/tmp/an-${n}.png`);console.log(n,r.status);}catch(e){console.log(n,'ERR',e.message)}}})();
