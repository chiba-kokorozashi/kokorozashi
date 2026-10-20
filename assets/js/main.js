/* 株式会社こころざし｜外国人材の受け入れ相談窓口 ― 共通のうごき */
// 公式LINEのベーシックID（@から始まる）
var LINE_ID = "@398hqutm";

function openLine(text) {
  location.href = "https://line.me/R/oaMessage/" + encodeURIComponent(LINE_ID) + "/?" + encodeURIComponent(text || "外国人材の受け入れについて相談したいです");
}

(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };

  /* ---------- メニュー ---------- */
  var b = $("burger"), n = $("navsp");
  if (b && n) {
    b.addEventListener("click", function () { n.classList.toggle("show"); b.classList.toggle("on"); });
    each("#navsp a", function (a) { a.addEventListener("click", function () { n.classList.remove("show"); b.classList.remove("on"); }); });
  }
  var here = location.pathname.split("/").pop().replace(/\.html$/, "") || "index";
  each(".nav a", function (a) { if (a.getAttribute("href").replace(/\.html$/, "") === here) a.setAttribute("aria-current", "page"); });

  /* ---------- 文章入りでLINEを開くリンク ---------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest(".js-line");
    if (!a) return;
    e.preventDefault();
    openLine(a.getAttribute("data-text"));
  });

  /* ---------- スマホ下部の固定バー ---------- */
  var fb = document.createElement("div");
  fb.className = "fixbar";
  fb.innerHTML = '<a class="f1" href="shindan.html">3分で受け入れ診断</a><a class="f2" href="' + (here === "index" ? "" : "index.html") + '#contact">LINEで相談</a>';
  document.body.appendChild(fb);
  var ct = $("contact");
  addEventListener("scroll", function () {
    var near = ct && ct.getBoundingClientRect().top < innerHeight * .7;
    fb.classList.toggle("show", scrollY > 400 && !near);
  }, { passive: true });

  /* ---------- ふわっと表示 ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    each(".hg, .worry li, .role-box, .pt, .ind, .sd, .steps li, .msg, .qa details, .chg, .indsec, .tbl-wrap", function (t) {
      var i = Array.prototype.indexOf.call(t.parentNode.children, t);
      t.classList.add("rv");
      t.style.transitionDelay = Math.min(i, 6) * .07 + "s";
      io.observe(t);
    });
  }

  /* ---------- 選ぶだけで相談文（index#contact） ---------- */
  var ask = $("ask");
  if (ask) (function () {
    var msg = $("askMsg"), area = $("askArea"), edited = false;
    var picked = { ind: [], num: [], when: [], now: [], want: [] };
    function build() {
      var L = ["外国人材の受け入れについて相談したいです。", ""];
      if (picked.ind.length) L.push("・業種：" + picked.ind.join("、"));
      if (picked.num.length) L.push("・人数：" + picked.num[0]);
      if (picked.when.length) L.push("・時期：" + picked.when[0]);
      if (picked.now.length) L.push("・いまの状況：" + picked.now[0]);
      if (picked.want.length) L.push("・知りたいこと：" + picked.want.join("、"));
      if (area.value.trim()) L.push("・所在地：" + area.value.trim());
      L.push("", "よろしくお願いします。");
      return L.join("\n");
    }
    function refresh() {
      if (edited) return;
      msg.value = build();
      msg.classList.remove("flash"); void msg.offsetWidth; msg.classList.add("flash");
    }
    each("#ask .ops", function (g) {
      var name = g.getAttribute("data-name"), many = g.getAttribute("data-many") === "1";
      g.addEventListener("click", function (e) {
        var btn = e.target.closest("button"); if (!btn) return;
        var v = btn.getAttribute("data-v") || btn.textContent;
        if (many) {
          btn.classList.toggle("on");
          var i = picked[name].indexOf(v); i < 0 ? picked[name].push(v) : picked[name].splice(i, 1);
        } else {
          var was = btn.classList.contains("on");
          Array.prototype.forEach.call(g.children, function (c) { c.classList.remove("on"); });
          if (!was) btn.classList.add("on");
          picked[name] = was ? [] : [v];
        }
        refresh();
      });
    });
    area.addEventListener("input", refresh);
    msg.addEventListener("input", function () { edited = true; });
    refresh();
    $("askSend").addEventListener("click", function (e) { e.preventDefault(); openLine(msg.value); });
    $("askCopy").addEventListener("click", function () {
      msg.select();
      var c = $("askCopy"), done = function () { c.textContent = "コピーしました。LINEやメールに貼り付けて送ってください"; };
      if (navigator.clipboard) navigator.clipboard.writeText(msg.value).then(done, function () { document.execCommand("copy"); done(); });
      else { document.execCommand("copy"); done(); }
    });
  })();

  /* ---------- 3分で受け入れ診断（shindan.html） ---------- */
  var quiz = $("quiz");
  if (quiz) (function () {
    var QS = [
      { k: "ind", q: "業種を教えてください", o: ["介護", "建設", "製造（工場）", "農業", "外食", "自動車整備", "運送（ドライバー）", "その他"] },
      { k: "want", q: "どんな人に来てほしいですか？", o: ["すぐに現場で働ける人", "時間をかけて育てたい", "まだ分からない"] },
      { k: "exp", q: "外国人を雇った経験は？", o: ["初めて", "いま雇っている", "前に雇っていた"] },
      { k: "num", q: "何人くらい考えていますか？", o: ["1〜2人", "3〜5人", "6人以上", "未定"] },
      { k: "when", q: "いつごろから来てほしいですか？", o: ["半年以内", "1年以内", "1年以上先", "未定"] },
      { k: "worry", q: "いちばん気になることは？", o: ["費用", "言葉・コミュニケーション", "住まいや生活の世話", "手続きの手間", "すぐ辞めないか"] }
    ];
    var ans = {}, i = 0;
    function render() {
      var Q = QS[i];
      $("qBar").style.width = (i / QS.length * 100) + "%";
      $("qCount").textContent = (i + 1) + " / " + QS.length;
      $("qQ").textContent = Q.q;
      $("qQ").style.animation = "none"; void $("qQ").offsetWidth; $("qQ").style.animation = "";
      $("qOps").innerHTML = Q.o.map(function (o) { return '<button type="button">' + o + "</button>"; }).join("");
      $("qBack").hidden = i === 0;
    }
    $("qOps").addEventListener("click", function (e) {
      var btn = e.target.closest("button"); if (!btn) return;
      ans[QS[i].k] = btn.textContent;
      i++;
      i < QS.length ? render() : result();
    });
    $("qBack").addEventListener("click", function () { if (i > 0) { i--; render(); } });
    $("qRetry").addEventListener("click", function () { ans = {}; i = 0; $("res").hidden = true; quiz.hidden = false; render(); quiz.scrollIntoView({ behavior: "smooth", block: "center" }); });

    function result() {
      var main, why = [];
      var onlyTokutei = ans.ind === "外食" || ans.ind === "運送（ドライバー）";
      if (ans.exp === "いま雇っている") {
        main = "いまの方の<em>特定技能への切り替え</em>と、<em>追加の受け入れ</em>";
        why.push("いま働いている技能実習生は、条件を満たせば特定技能に切り替えて、長く働いてもらえます。");
        why.push("2027年4月からは技能実習が育成就労に変わります。追加の受け入れは、新しい制度に合わせて考えるのがおすすめです。");
      } else if (ans.want === "すぐに現場で働ける人" || onlyTokutei) {
        main = "<em>特定技能</em>での受け入れ";
        why.push("試験に合格した、ある程度経験のある人を採用できる制度です。");
        if (onlyTokutei) why.push(ans.ind + "は、主に特定技能で受け入れる業種です。");
        if (ans.ind === "運送（ドライバー）") why.push("ドライバーは日本の運転免許の取得が必要なので、準備期間を長めに見ておきます。");
      } else if (ans.want === "時間をかけて育てたい") {
        main = "<em>技能実習</em>（2027年4月からは<em>育成就労</em>）";
        why.push("未経験の人を3年ほどかけて育て、その後は特定技能に進んでもらう流れが基本です。");
        why.push(ans.when === "半年以内" ? "半年以内なら、いまの技能実習で準備を始めるのが現実的です。" : "時期によっては、2027年4月に始まる育成就労で受け入れる方がよい場合があります。");
      } else {
        main = "<em>特定技能</em>か<em>育成就労</em>（ご相談のうえで決定）";
        why.push("業種・人数・時期・予算によって、合う制度と提携先が変わります。");
        why.push("まずは状況をうかがって、選択肢を並べてご説明します。");
      }
      if (ans.ind === "建設") why.push("建設分野の特定技能は、国の受入計画の認定など、ほかの業種にはない手続きがあります。");
      if (ans.ind === "介護") why.push("介護は、日本語の力が求められる分野です。入国前の日本語教育がしっかりした提携先をご紹介します。");
      if (ans.worry === "費用") why.push("費用は提携先ごとに違います。複数の見積もりを並べてお見せできます。");
      if (ans.worry === "すぐ辞めないか") why.push("定着には、受け入れ後の生活サポートが大切です。サポート体制まで含めて提携先を選びます。");
      $("resMain").innerHTML = main;
      $("resWhy").innerHTML = why.map(function (w) { return "<li>" + w + "</li>"; }).join("");
      var text = ["外国人材の受け入れ診断をやりました。", "",
        "・業種：" + ans.ind, "・来てほしい人：" + ans.want, "・外国人の雇用経験：" + ans.exp,
        "・人数：" + ans.num, "・時期：" + ans.when, "・気になること：" + ans.worry, "",
        "結果は「" + main.replace(/<[^>]+>/g, "") + "」でした。", "くわしく相談したいです。よろしくお願いします。"].join("\n");
      $("resLine").setAttribute("data-text", text);
      $("qBar").style.width = "100%";
      quiz.hidden = true; $("res").hidden = false;
      $("res").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    render();
  })();
})();
