import assert from 'node:assert/strict';
import '../quiz-data.js';
const { questions, axes, score, routeFor, types } = globalThis.JiahaoQuiz;
assert.equal(questions.length, 16);
axes.forEach((_,i)=>assert.equal(questions.filter(q=>q.axis===i).length,4));
questions.forEach(q=>assert.deepEqual(q.options.map(o=>o.score).sort(),[0,1,2,3]));
for (const key of Object.keys(types)) assert.equal(score(routeFor(key)).key, key);
assert.equal(score(routeFor('relaxed')).index,0);
assert.equal(score(routeFor('all')).index,100);
for (let target=0;target<=48;target++) {
  let remaining=target;
  const answers=questions.map(q=>{const points=Math.min(3,remaining);remaining-=points;return q.options.findIndex(o=>o.score===points);});
  const r=score(answers);
  assert.equal(r.total,target);
  assert.equal(r.index,Math.round(target/48*100));
  assert.equal(r.key==='relaxed',r.index<20);
  assert.equal(r.key==='all',r.index>=80);
  assert.deepEqual(r,score(answers));
  r.evidence.forEach(e=>assert.equal(e.answer,questions[e.question-1].options[answers[e.question-1]].text));
}
assert.throws(()=>score([])); assert.throws(()=>score(Array(16).fill(-1)));
const before=routeFor('relaxed'); const first=score(before);
before[0]=questions[0].options.findIndex(o=>o.score===3);
assert.equal(score(before).total-first.total,3);
assert.equal(score(before).index,6);
console.log('Passed: 4 balanced dimensions, 6 reachable types, all 49 attainable totals, deterministic results, evidence and changed-answer recalculation.');
