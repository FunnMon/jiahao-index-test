(function () {
  'use strict';
  const { questions, axes, score, isAnswer, version } = window.JiahaoQuiz;
  const $ = id => document.getElementById(id);
  const storageKey = 'jiahao-index-v1';
  let answers = Array(16).fill(null), current = 0, currentView = 'home', result = null;
  let storageAvailable = true, imageUrl = null, pendingTrial = null;
  const escape = text => String(text).replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && saved.version === version && Array.isArray(saved.answers) && saved.answers.length === 16 && saved.answers.every(a => a === null || isAnswer(a))) {
        answers = saved.answers;
        current = Number.isInteger(saved.current) ? Math.max(0, Math.min(15, saved.current)) : 0;
      }
    } catch { storageAvailable = false; }
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify({version, answers, current})); }
    catch { storageAvailable = false; }
  }
  function complete() { return answers.every(isAnswer); }
  function hasProgress() { return answers.some(isAnswer); }
  function show(view, updateHistory = true) {
    currentView = view;
    for (const id of ['home','quiz','result']) $(id).hidden = id !== view;
    $('resume-button').hidden = !hasProgress();
    if (view === 'quiz') renderQuestion();
    if (view === 'result') renderResult();
    if (updateHistory && location.hash !== '#' + view) history.pushState(null, '', '#' + view);
    window.scrollTo({top:0, behavior:'instant'});
  }
  function focusHeading(id) { requestAnimationFrame(() => $(id)?.focus({preventScroll:true})); }
  function begin() {
    if (hasProgress()) { $('restart-dialog').showModal(); return; }
    current = 0; show('quiz'); focusHeading('question-title');
  }
  function reset() {
    answers = Array(16).fill(null); current = 0; result = null; persist();
    if (isAnswer(pendingTrial)) { answers[0] = pendingTrial; current = 1; pendingTrial = null; persist(); }
    if (imageUrl) { URL.revokeObjectURL(imageUrl); imageUrl = null; }
    $('restart-dialog').close(); show('quiz'); focusHeading('question-title');
  }
  function renderQuestion() {
    const q = questions[current];
    $('quiz').innerHTML = `
      <div class="quiz-top"><button type="button" class="text-button" id="back-home">返回首页</button><span role="status">第 ${String(current+1).padStart(2,'0')} / 16 题</span></div>
      <progress value="${current}" max="16" aria-label="答题进度"></progress>
      <div class="question-layout">
        <div class="question-side"><span class="question-num" aria-hidden="true">${String(current+1).padStart(2,'0')}</span><p>${axes[q.axis].name}</p><p class="muted">没有标准答案。<br>选最像你的那个。</p></div>
        <form id="question-form"><h1 id="question-title" tabindex="-1">${escape(q.text)}</h1>
          <fieldset class="answer-list"><legend class="visually-hidden">选择你的反应</legend>${q.options.map((o,i)=>`
            <label class="answer-option"><input type="radio" name="answer" value="${i}" ${answers[current]===i?'checked':''}><span class="answer-letter" aria-hidden="true">${String.fromCharCode(65+i)}</span><span>${escape(o.text)}</span></label>`).join('')}</fieldset>
          <div class="question-actions"><button class="button" type="button" id="previous" ${current===0?'disabled':''}>上一题</button><button class="button primary" type="submit" id="next" ${isAnswer(answers[current])?'':'disabled'}>${current===15?'生成我的档案':'下一题'}</button></div>
          <p class="save-hint" id="save-hint">${storageAvailable?'进度自动保存在当前浏览器。':'浏览器无法保存进度，本次仍可正常完成测评。'}</p>
        </form>
      </div>`;
    $('back-home').onclick = () => show('home');
    $('previous').onclick = () => { if (current > 0) { current--; persist(); renderQuestion(); focusHeading('question-title'); } };
    $('question-form').onchange = e => {
      const chosen = Number(e.target.value);
      if (isAnswer(chosen)) { answers[current] = chosen; persist(); $('next').disabled = false; }
      if (!storageAvailable) $('save-hint').textContent = '浏览器无法保存进度，本次仍可正常完成测评。';
    };
    $('question-form').onsubmit = e => {
      e.preventDefault(); if (!isAnswer(answers[current])) return;
      if (current === 15) {
        if (complete()) { persist(); show('result'); focusHeading('result-title'); }
        else { current = answers.findIndex(a=>!isAnswer(a)); renderQuestion(); focusHeading('question-title'); }
      } else { current++; persist(); renderQuestion(); focusHeading('question-title'); }
    };
  }
  function renderResult() {
    if (!complete()) { show('home'); return; }
    result = score(answers);
    const r = result;
    $('result').innerHTML = `
      <div class="result-top"><span>你的嘉豪档案已生成</span><button type="button" class="text-button" id="edit-answers">修改答案</button></div>
      <div class="result-hero"><div class="result-score"><div class="score-number">${r.index}<span>/100</span></div><p>嘉豪指数</p><span class="level-label">${r.level}</span></div>
        <div class="result-intro"><h1 id="result-title" tabindex="-1">${r.type.name}</h1><p class="result-quote">${r.type.quote}</p><p class="result-story">${r.type.story}</p></div></div>
      <div class="result-actions"><button class="button primary" id="save-image" type="button">保存我的结果图</button><button class="button" id="restart-result" type="button">重新测一次</button></div>
      <p class="save-hint" id="image-status" role="status">生成 PNG 图片，适合发给朋友一起玩。</p>
      <div id="generated-image" class="generated-image" hidden></div>
      <section class="dimensions" aria-labelledby="dimension-title"><h2 id="dimension-title">你的主角配方</h2><div class="dimension-list">${axes.map((a,i)=>`<div class="dimension-row"><div><h3>${a.name}</h3><p>${a.line}</p></div><meter min="0" max="100" value="${r.values[i]}" aria-label="${a.name} ${r.values[i]} 分"></meter><strong>${r.values[i]}<small>/100</small></strong></div>`).join('')}</div></section>
      <section class="evidence" aria-labelledby="evidence-title"><h2 id="evidence-title">是这些瞬间，豪到了</h2><ol>${r.evidence.map(e=>`<li><p class="evidence-question">第 ${e.question} 题：${escape(e.text)}</p><blockquote>${escape(e.answer)}</blockquote><p class="evidence-read">${e.read}</p></li>`).join('')}</ol></section>
      <section class="result-close"><h2>给你的片尾彩蛋</h2><p>${r.index<20?'保持这种舒服的节奏。想表达时，也可以大大方方地给自己一点镜头。':r.tip}</p><p class="muted">“嘉豪”在这里是一种自嘲的表达方式。分数高低都不是优劣，也不用于评价他人。</p></section>`;
    $('edit-answers').onclick = () => { current = 0; show('quiz'); focusHeading('question-title'); };
    $('restart-result').onclick = () => { pendingTrial = null; $('restart-dialog').showModal(); };
    $('save-image').onclick = saveImage;
  }
  function canvasWrap(ctx, text, x, y, maxWidth, lineHeight) {
    let line = '';
    for (const char of text) {
      if (char === '\n' || (line && ctx.measureText(line + char).width > maxWidth)) { ctx.fillText(line,x,y); line = char === '\n' ? '' : char; y += lineHeight; }
      else line += char;
    }
    if (line) ctx.fillText(line,x,y);
    return y + lineHeight;
  }
  async function makeImage(r) {
    if (document.fonts?.ready) await document.fonts.ready;
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1560;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('当前浏览器不支持图片生成。');
    const css = getComputedStyle(document.documentElement), token = name => css.getPropertyValue(name).trim();
    const ink = token('--color-ink'), dark = token('--color-dark'), lime = token('--color-accent'), muted = token('--color-muted');
    const face = token('--font-body');
    ctx.fillStyle = dark; ctx.fillRect(0,0,1080,1560);
    ctx.textBaseline = 'top'; ctx.fillStyle = ink; ctx.font = `700 34px ${face}`; ctx.fillText('嘉豪指数测试',72,64);
    ctx.fillStyle = muted; ctx.font = `400 25px ${face}`; ctx.fillText('我的主角模式报告',72,115);
    ctx.fillStyle = lime; ctx.font = `900 220px ${face}`; ctx.fillText(String(r.index),64,184);
    const numWidth = ctx.measureText(String(r.index)).width;
    ctx.font = `500 44px ${face}`; ctx.fillText('/100',82+numWidth,342);
    ctx.fillStyle = ink; ctx.font = `500 30px ${face}`; ctx.fillText('嘉豪指数',72,430);
    ctx.font = `800 70px ${face}`; ctx.fillText(r.type.name,72,510);
    ctx.font = `500 34px ${face}`; let y = canvasWrap(ctx,r.type.quote,72,612,936,52);
    y = Math.max(y+32,748);
    axes.forEach((a,i)=>{
      ctx.fillStyle = ink; ctx.font = `500 30px ${face}`; ctx.fillText(a.name,72,y);
      ctx.fillStyle = token('--color-paper-3'); ctx.fillRect(300,y+7,530,22);
      ctx.fillStyle = lime; ctx.fillRect(300,y+7,530*r.values[i]/100,22);
      ctx.fillStyle = ink; ctx.font = `700 30px ${face}`; ctx.textAlign = 'right'; ctx.fillText(String(r.values[i]),1008,y); ctx.textAlign = 'left'; y+=76;
    });
    y += 22; ctx.fillStyle = lime; ctx.fillRect(72,y,936,2); y += 38;
    ctx.fillStyle = muted; ctx.font = `500 26px ${face}`; ctx.fillText(`属于我的一幕 / 第 ${r.evidence[0].question} 题`,72,y); y+=48;
    ctx.fillStyle = ink; ctx.font = `600 33px ${face}`; y = canvasWrap(ctx,r.evidence[0].answer,72,y,936,50);
    ctx.font = `400 27px ${face}`; ctx.fillStyle = muted; canvasWrap(ctx,r.index<20?'想表达时，也可以大大方方地给自己一点镜头。':r.tip,72,y+22,936,44);
    ctx.fillStyle = ink; ctx.font = `600 30px ${face}`; ctx.fillText('偶尔嘉豪，也没什么不好。',72,1404);
    ctx.fillStyle = muted; ctx.font = `400 23px ${face}`; ctx.fillText('原创娱乐测评，不代表人格或心理诊断。',72,1464);
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('图片生成失败，请重试。')),'image/png'));
  }
  async function saveImage() {
    const button = $('save-image'); button.disabled = true; button.textContent = '正在生成图片';
    try {
      const blob = await makeImage(result);
      if (imageUrl) URL.revokeObjectURL(imageUrl); imageUrl = URL.createObjectURL(blob);
      const name = `嘉豪指数-${result.index}-${result.type.name}.png`;
      const link = document.createElement('a'); link.href = imageUrl; link.download = name; document.body.append(link); link.click(); link.remove();
      $('generated-image').hidden = false;
      $('generated-image').innerHTML = `<img src="${imageUrl}" alt="我的嘉豪指数 ${result.index}，${result.type.name}，完整结果图"><a class="button" href="${imageUrl}" target="_blank" rel="noopener">打开图片</a>`;
      $('image-status').textContent = '图片已生成。如果手机没有直接下载，可打开图片后长按保存。';
    } catch (error) { $('image-status').textContent = error.message || '图片生成失败，请重试。'; }
    finally { button.disabled = false; button.textContent = '保存我的结果图'; }
  }
  const restart = document.createElement('dialog'); restart.id = 'restart-dialog'; restart.setAttribute('aria-labelledby','restart-title');
  restart.innerHTML = '<h2 id="restart-title">重新开始吗？</h2><p>当前浏览器中的答案会被新的测评替换。</p><div class="dialog-actions"><button class="button" id="cancel-restart" type="button">保留进度</button><button class="button primary" id="confirm-restart" type="button">重新开始</button></div>';
  document.body.append(restart); $('cancel-restart').onclick = () => { pendingTrial = null; restart.close(); }; $('confirm-restart').onclick = reset;
  restart.addEventListener('cancel', () => { pendingTrial = null; });
  $('rules-button').onclick = () => $('rules').showModal(); $('close-rules').onclick = () => $('rules').close();
  $('start-button').onclick = () => { pendingTrial = null; begin(); };
  $('resume-button').onclick = () => { show(complete()?'result':'quiz'); focusHeading(complete()?'result-title':'question-title'); };
  $('trial').onsubmit = e => {
    e.preventDefault(); const chosen = Number(e.submitter?.value);
    if (!isAnswer(chosen)) return;
    if (hasProgress()) { pendingTrial = chosen; $('resume-button').hidden = false; begin(); return; }
    answers[0] = chosen; current = 1; persist(); show('quiz'); focusHeading('question-title');
  };
  document.querySelector('.wordmark').onclick = e => { e.preventDefault(); show('home'); };
  window.addEventListener('popstate',()=>route());
  function route() {
    const hash = location.hash.slice(1);
    show(hash==='result' && complete() ? 'result' : hash==='quiz' && hasProgress() ? 'quiz' : 'home',false);
  }
  restore(); route();
  window.JiahaoApp = { makeImage };
})();
