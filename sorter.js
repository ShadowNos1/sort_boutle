// Кол-во мест в пробирке
const V = 4;

// Пример: 4 пробирки, три из них заполнены
// Цвета снизу вверх
const tubes = [
  ["R","G","G","R"],
  ["B","R","B","G"],
  ["B","G","R","B"],
  [] // пустая
];

// Проверка цели: каждая непустая пробирка заполнена одним цветом
function isGoal(state) {
  return state.every(t => t.length === 0 || (t.length === V && t.every(c => c === t[0])));
}

// Получить верхний цвет и сколько подряд
function topInfo(tube) {
  if (!tube.length) return null;
  const col = tube.at(-1);
  let cnt = 0;
  for (let i = tube.length-1; i>=0 && tube[i]===col; i--) cnt++;
  return {col, cnt};
}

// Все возможные ходы (from,to)
function moves(state) {
  const res = [];
  for (let i=0;i<state.length;i++) {
    if (!state[i].length) continue;
    const {col,cnt} = topInfo(state[i]);
    for (let j=0;j<state.length;j++) if (i!==j) {
      const free = V - state[j].length;
      if (free>0 && (state[j].length===0 || state[j].at(-1)===col)) {
        res.push([i,j,Math.min(cnt,free)]);
      }
    }
  }
  return res;
}

// Применить ход
function apply(state,[a,b,n]) {
  const copy = state.map(t=>t.slice());
  const moved = copy[a].splice(copy[a].length-n,n);
  copy[b].push(...moved);
  return copy;
}

// Поиск (DFS, без оптимальности)
function solve(start,limit=1000) {
  const seen = new Set();
  function dfs(state,path) {
    if (isGoal(state)) return path;
    if (path.length>=limit) return null;
    const key = state.map(t=>t.join("")).join("|");
    if (seen.has(key)) return null;
    seen.add(key);
    for (const m of moves(state)) {
      const next = apply(state,m);
      const r = dfs(next,[...path,m]);
      if (r) return r;
    }
    return null;
  }
  return dfs(start,[]);
}

const res = solve(tubes);
console.log(res ? res.map(([a,b])=>`(${a},${b})`).join(" ") : "Нет решения");
