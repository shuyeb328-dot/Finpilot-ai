import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const dir = process.env.DATA_DIR || './data';
const file = path.join(dir, 'finpilot-store.json');
async function load(){try{return JSON.parse(await readFile(file,'utf8'));}catch{return {decisions:[],deals:[],events:[]};}}
async function save(db){await mkdir(dir,{recursive:true}); await writeFile(file,JSON.stringify(db,null,2));}
export async function append(collection,item){const db=await load();db[collection]??=[];db[collection].push(item);await save(db);return item;}
export async function list(collection,limit=50){const db=await load();return (db[collection]||[]).slice(-limit).reverse();}
