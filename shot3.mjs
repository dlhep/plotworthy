import { createRequire } from "module";
const require = createRequire("/home/claude/plotworthy/");
const { chromium } = require("playwright");
const b = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await (await b.newContext({ viewport:{width:1000,height:900} })).newPage();
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
await p.goto("file:///home/claude/plotworthy-preview.html",{waitUntil:"networkidle"});
await p.waitForTimeout(600);
await p.evaluate(()=>{ render("hub",{slug:"hmo",at:2}); });
await p.waitForTimeout(500);
// open an upcoming stage (stage 5 index 4) to compare
await p.evaluate(()=>{ const s=document.querySelectorAll('.step')[4]; s.querySelector('[data-step-toggle]').click(); s.scrollIntoView(); });
await p.waitForTimeout(400);
await p.screenshot({path:"/home/claude/shots/detail-compare.png", fullPage:true});
console.log(JSON.stringify({errs}));
await b.close();
