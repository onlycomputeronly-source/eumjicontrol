require("dotenv").config();
const express=require("express");
const session=require("express-session");
const helmet=require("helmet");
const rateLimit=require("express-rate-limit");
const cors=require("cors");
const fs=require("fs");
const path=require("path");
const crypto=require("crypto");

const app=express();
// Render runs behind a reverse proxy; trust it so HTTPS origins are detected correctly.
app.set("trust proxy", 1);
const PORT=process.env.PORT||3000;
const DATA_DIR=path.join(__dirname,"data");
const DB_FILE=path.join(DATA_DIR,"notices.json");
fs.mkdirSync(DATA_DIR,{recursive:true});
if(!fs.existsSync(DB_FILE))fs.writeFileSync(DB_FILE,"[]","utf8");
if(!process.env.ADMIN_USERNAME||!process.env.ADMIN_PASSWORD||!process.env.SESSION_SECRET){
  console.error("필수 환경변수 ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET를 설정하세요.");
  process.exit(1);
}
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"100kb"}));

// GitHub Pages 공개 사이트와 Node 관리자 서버 사이의 읽기 API 연결을 허용합니다.
// PUBLIC_SITE_ORIGIN에는 https://계정.github.io 형식으로 입력합니다(저장소 경로 제외).
const allowedOrigins = new Set([
  process.env.PUBLIC_SITE_ORIGIN,
  process.env.BACKEND_ORIGIN,
  "http://localhost:3000",
  "http://127.0.0.1:3000"
].filter(Boolean));
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("허용되지 않은 웹사이트에서 요청했습니다."));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
};
app.use((req, res, next) => {
  const origin = req.get("Origin");
  const ownOrigin = `${req.protocol}://${req.get("host")}`;
  // 관리자 화면과 API가 같은 Node 서버에서 제공될 때는 같은 출처 요청으로 통과
  if (!origin || origin === ownOrigin) return next();
  return cors(corsOptions)(req, res, next);
});
app.use(session({
  name:"eumji.admin.sid",
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{httpOnly:true,sameSite:"strict",secure:process.env.NODE_ENV==="production",maxAge:1000*60*60*4}
}));
const loginLimiter=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:true,legacyHeaders:false});
function readNotices(){return JSON.parse(fs.readFileSync(DB_FILE,"utf8"))}
function writeNotices(items){const temp=DB_FILE+".tmp";fs.writeFileSync(temp,JSON.stringify(items,null,2),"utf8");fs.renameSync(temp,DB_FILE)}
function safeEqual(a,b){const aa=Buffer.from(String(a));const bb=Buffer.from(String(b));return aa.length===bb.length&&crypto.timingSafeEqual(aa,bb)}
function requireAdmin(req,res,next){if(req.session&&req.session.admin===true)return next();return res.status(401).json({error:"관리자 로그인이 필요합니다."})}
app.post("/api/auth/login",loginLimiter,(req,res)=>{
 const {username,password}=req.body||{};
 if(safeEqual(username||"",process.env.ADMIN_USERNAME)&&safeEqual(password||"",process.env.ADMIN_PASSWORD)){
  req.session.regenerate(err=>{if(err)return res.status(500).json({error:"세션 생성에 실패했습니다."});req.session.admin=true;res.json({ok:true})});
 }else res.status(401).json({error:"아이디 또는 비밀번호가 올바르지 않습니다."});
});
app.get("/api/auth/me",(req,res)=>req.session?.admin?res.json({authenticated:true}):res.status(401).json({error:"로그인이 필요합니다."}));
app.post("/api/auth/logout",(req,res)=>req.session.destroy(()=>{res.clearCookie("eumji.admin.sid");res.json({ok:true})}));

// 공개 페이지에서 읽을 수 있는 공지사항 목록
app.get("/api/notices",(req,res)=>res.json(readNotices().sort((a,b)=>b.date.localeCompare(a.date))));
// 관리자 전용 등록/수정/삭제
app.post("/api/notices",requireAdmin,(req,res)=>{
 const {category,title,body,date}=req.body||{};
 if(!title||!body||!date)return res.status(400).json({error:"제목, 내용, 등록일을 입력하세요."});
 const items=readNotices();const item={id:crypto.randomUUID(),category:String(category||"공지"),title:String(title).slice(0,120),body:String(body).slice(0,10000),date:String(date)};
 items.push(item);writeNotices(items);res.status(201).json(item);
});
app.put("/api/notices/:id",requireAdmin,(req,res)=>{
 const items=readNotices();const i=items.findIndex(x=>x.id===req.params.id);if(i<0)return res.status(404).json({error:"게시물을 찾을 수 없습니다."});
 const {category,title,body,date}=req.body||{};if(!title||!body||!date)return res.status(400).json({error:"제목, 내용, 등록일을 입력하세요."});
 items[i]={...items[i],category:String(category||"공지"),title:String(title).slice(0,120),body:String(body).slice(0,10000),date:String(date)};writeNotices(items);res.json(items[i]);
});
app.delete("/api/notices/:id",requireAdmin,(req,res)=>{const items=readNotices();const next=items.filter(x=>x.id!==req.params.id);if(next.length===items.length)return res.status(404).json({error:"게시물을 찾을 수 없습니다."});writeNotices(next);res.json({ok:true})});

// 기존 공개 HTML 파일 제공
app.use(express.static(__dirname));
app.get("/",(req,res)=>res.sendFile(path.join(__dirname,"index.html")));
app.listen(PORT,()=>console.log(`음지중앙정보국 서버: http://localhost:${PORT}`));
