const now = new Date();

const month = now.getMonth() + 1;
const date = now.getDate();

const weekNames = ["周日","周一","周二","周三","周四","周五","周六"];
const day = now.getDay();
const weekText = weekNames[day];

// 开学第一周的周一
const TERM_START = new Date(2026, 7, 31);  // 月份写进去要-1

function getWeekNumber() {
    const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const days = Math.round((today0 - TERM_START) / MS_PER_DAY);
    return Math.floor(days / 7) + 1; 
}

const line = document.querySelector("#today-line")
line.textContent = month + "月" + date + "日 · " + weekText + " · 第 " + getWeekNumber() + " 周";

// 把[一天的四节课] 写成数据
//10 把一天换成一周七天，只填一次
const WEEKLY = {
    1: [
        {name:"形势与政策", start:"10:15", end:"11:50", room:"教一 104"},
        {name:"信息技术", start:"14:00", end:"17:30", room:"教一 310"}
    ],
    2: [
        {name:"思想道德与法治", start:"10:15", end:"11:50", room:"教四 207"},
        {name:"网页设计与实践", start:"14:00", end:"15:35", room:"教一 301"},
        {name:"Java程序设计", start:"15:55", end:"17:30", room:"教一 306"}
    ],
    3: [
        {name:"形势与政策", start:"8:20", end:"09:55", room:"教一 阶一"}
    ],
    4: [
        {name:"大学英语", start:"08:20", end:"09:55", room:"教一 阶四"},
        {name:"思想道德与法治", start:"10:15", end:"11:50", room:"教一 阶四"},
        {name:"网页设计与实践", start:"14:00", end:"15:35", room:"教一 301"},
        {name:"大学体育", start:"15:55", end:"17:30", room:"田径场"},
        {name:"中国传统文化", start:"19:00", end:"20:40", room:"教一 206"}
    ],
    5: [
        {name:"云计算", start:"14:00", end:"15:35", room:"教一 315"},
        {name:"大学英语", start:"15:55", end:"17:30", room:"教一 501"}
    ],
    6: [],
    0: []
};

  // 11.临时补课 / 停课，按具体日期记====================================================================
  const OVERRIDES = {     //OVERRIDES:按日期记的临时课表
  //  "2026-11-10": [{ name:"补课", start: "17:30", end:"18:40", room:"教一 301"}]
      "2026-11-10": [],
      "2026-11-11": []
      
      
    
  };

  const mm = String(now.getMonth() + 1).padStart(2, "0"); //mm:补零后的月份
  const dd = String(now.getDate()).padStart(2,"0");
  const todayKey = now.getFullYear() + "-" + mm + "-" + dd;
  
  const TODAY_LESSONS = OVERRIDES[todayKey] || WEEKLY[day];
const hint = document.querySelector("#hint");
hint.textContent = "数据装好了：今天共 " + TODAY_LESSONS.length + " 节课";

//7用数据把卡片吐进页面
const list = document.querySelector("#schedule-list");
list.innerHTML = "";

let html = "";

for (const lesson of TODAY_LESSONS) {
    html += `
        <li class="lesson">
            <h3>${lesson.name}</h3>
            <p>${lesson.start} - ${lesson.end} · ${lesson.room}</p>
        </li>
    `;
}

list.innerHTML = html;

//8按当前时间算出【下一节】是第几节
function toMinutes(timeText) {
    const parts = timeText.split(":");
    return Number(parts[0]) * 60 + Number(parts[1]);
}

const nowMinutes = now.getHours() * 60 + now.getMinutes();

let nextIndex = -1;
let i = 0;
for (const lesson of TODAY_LESSONS) {
    if (toMinutes(lesson.start) > nowMinutes) {
        nextIndex = i;
        break;
    }
    i++;
}

//12.今天一节课都没有事，给一句空状态
//13.给下一节加一句还有几分钟
if (TODAY_LESSONS.length === 0) {0
    hint.textContent = "今天没课，直接耍起٩(๑>◡<๑)۶ ";
} else if (nextIndex === -1) {
    hint.textContent = "终于结束了，耍起来(ૢ˃ꌂ˂⁎)";
} else {
    const stratMinutes = toMinutes(TODAY_LESSONS[nextIndex].start) //startMinutes:下一节课开始，折现从零点过了多少分钟
    const leftMinutes = stratMinutes - nowMinutes; // leftMinutes:从现在到下节课上课，还剩多少分钟
    hint.textContent = "下一节是第 " + (nextIndex + 1) + " 节 · " + TODAY_LESSONS[nextIndex].name + " · 还有 " + leftMinutes + " 分钟"
}

//9把算出来的下一节框起来
const cards = list.querySelectorAll(".lesson"); //cards:页面上所有的卡<li>

if(nextIndex !== -1) {
    const nextCard = cards[nextIndex]; //nextCard:编号对应的哪一张卡，nextIndex+1表示下一节是第几节课
    nextCard.classList.add("next");

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "下一节";
    nextCard.appendChild(badge);
}

//14 每分钟自动重来一次
setInterval(function () { location.reload(); }, 60*1000); 

//15 切回前台，立刻重来一次
document.addEventListener("Visibilitychange",function () {
    if(!document.hidden) {
        location.reload();
    }
});

//把{第几周}换算成能直接抄进OVERRIDES的日期
const weekNo = getWeekNumber();   //weekNo:今天在本学期第几周
const monday = new Date(TERM_START);  //monday;复印一份[第1周星期一]
monday.setDate(monday.getDate() + (weekNo - 1) * 7);
const monM = String(monday.getMonth() + 1).padStart(2, "0");
const monD = String(monday.getDate()).padStart(2, "0");
const mondayKey = monday.getFullYear() + "-" + monM + "-" + monD;

line.textContent = line.textContent + " · 本周 " + mondayKey + " 起"; 
