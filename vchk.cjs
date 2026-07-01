const sharp=require("sharp");const fs=require("fs");
const dir="public/images/animals/giant-anteater/web";
const files=fs.existsSync(dir)?fs.readdirSync(dir):[];
const want=["hero","closeup","baby","family"];
for(const w of want){const f=files.find(x=>x.includes(`-${w}`)&&/\.(webp|jpe?g|png)$/.test(x));if(f){sharp(`${dir}/${f}`).resize(420).png().toFile(`/tmp/fin-${w}.png`).then(()=>console.log(w,"OK",f)).catch(e=>console.log(w,"ERR",e.message));}else console.log(w,"MISSING")}
