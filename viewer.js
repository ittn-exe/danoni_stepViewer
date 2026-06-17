'use strict';

// ===== ユーザー設定（パスをここで変更してください） =====
const CONFIG = {
    KEY_MAP_PATH: './analyzer/key_map.json', // key_map.jsonのパス
    IMG_DIR:      './analyzer/img',           // ノート画像ディレクトリのパス（末尾スラッシュなし）
    MUSIC_LIST:   './music_list.json',        // music_list.jsonのパス
};

// ===== 表示設定 =====
// レイアウト
const LANE_WIDTH           = 45;   // レーン1本あたりの横幅(px)。フリーズバー位置も連動する
const NOTE_SIZE            = 40;   // ノート画像の表示サイズ(px)
const CHART_PADDING_BOTTOM = 800;  // 譜面エリア下部の余白(px)。最後のノートの後にどれだけ空白を置くか

// speed_data表示色
const SPEED_LABEL_COLOR = '#aaa';  // speed_dataラベルの文字色
const SPEED_LINE_COLOR  = '#333';  // speed_data横線の色

// boost_data表示色
const BOOST_LABEL_COLOR = '#ff9900'; // boost_dataラベルの文字色
const BOOST_LINE_COLOR  = '#553300'; // boost_data横線の色（暗めにするとノートと被りにくい）

// ===== 状態管理 =====
let KEY_MAP = {};
const state = {
    fullData: {},
    zoom: 5.0,
    currentSuffix: '',
    maxFrame: 0,
    isReverse: false,
    showSpeedInterval: false,
    keyType: '7',
    frameToY: (frame) => frame * 5.0,
};

// ===== 初期化 =====
window.addEventListener('DOMContentLoaded', async () => {
    await loadKeyMap();
    await loadSongList();

    document.getElementById('zoom-slider').oninput = (e) => {
        state.zoom = parseFloat(e.target.value);
        document.getElementById('zoom-val').textContent = `x${state.zoom.toFixed(1)}`;
        renderChart();
    };

    document.getElementById('rev-toggle').onclick = function () {
        state.isReverse = !state.isReverse;
        this.textContent = `REVERSE: ${state.isReverse ? 'ON' : 'OFF'}`;
        this.classList.toggle('active', state.isReverse);
        const area = document.getElementById('chart-area');
        area.style.transform = state.isReverse ? 'scaleY(-1)' : '';
        area.querySelectorAll('.note-container').forEach(el => {
            const angle = parseFloat(el.dataset.angle || '0');
            const cancel = state.isReverse ? ' scaleY(-1)' : '';
            el.style.transform = `translateY(-50%)${cancel} rotate(${angle}deg)`;
        });
        area.querySelectorAll('.speed-label, .boost-label').forEach(el => {
            const cancel = state.isReverse ? ' scaleY(-1)' : '';
            el.style.transform = `translateY(-50%)${cancel}`;
        });
        drawMinimap();
    };

    document.getElementById('speed-toggle').onclick = function () {
        state.showSpeedInterval = !state.showSpeedInterval;
        this.textContent = `SPEED間隔: ${state.showSpeedInterval ? 'ON' : 'OFF'}`;
        this.classList.toggle('active', state.showSpeedInterval);
        renderChart();
    };

    // ミニマップクリック
    const minimap = document.getElementById('minimap-canvas');
    const mainView = document.getElementById('main-view');
    if (minimap && mainView) {
        minimap.onclick = (e) => {
            if (state.maxFrame <= 0) return;
            const rect = minimap.getBoundingClientRect();
            const ratio = (e.clientY - rect.top) / rect.height;
            mainView.scrollTo({ top: mainView.scrollHeight * ratio - mainView.clientHeight / 2, behavior: 'auto' });
        };
        mainView.addEventListener('scroll', () => {
            const indicator = document.getElementById('view-indicator');
            if (!indicator) return;
            const scrollPercent = mainView.scrollTop / (mainView.scrollHeight - mainView.clientHeight);
            const viewPercent = mainView.clientHeight / mainView.scrollHeight;
            indicator.style.top = (scrollPercent * (100 - viewPercent * 100)) + '%';
            indicator.style.height = (viewPercent * 100) + '%';
        });
    }
});

// ===== key_map.json 読み込み =====
async function loadKeyMap() {
    try {
        const res = await fetch(CONFIG.KEY_MAP_PATH);
        KEY_MAP = await res.json();
    } catch (e) { console.error('key_map.json の読み込みに失敗:', e); }
}

// ===== 曲リスト読み込み =====
// music_list.json 書式:
// {
//   "songs": [
//     { "name": "曲名", "file": "2026/xxxx.txt" },
//     { "name": "曲名（ファイル分割譜面）", "file": ["2026/yyyy.txt", "2026/yyyy2.txt"], "group": "2026" }
//   ]
// }
// ・"file" は単一パス(文字列)、または分割ファイル群(配列)のどちらでも指定可能
//   配列の場合、本体の「外部dos分割（externalDosDivide）」と同じ並び順
//   （1番目=サフィックスなしファイル、2番目=...2.txt 相当）で渡すこと
// ・"group" を指定すると曲リスト上でグループ見出しが付く（省略可）
async function loadSongList() {
    try {
        const res = await fetch(CONFIG.MUSIC_LIST);
        const data = await res.json();
        const container = document.getElementById('song-list');
        const songs = data.songs || [];

        // グループごとにまとめる（groupキーなし → グループ '' として扱う）
        const groupMap = new Map();
        songs.forEach(song => {
            const g = song.group !== undefined ? String(song.group) : '';
            if (!groupMap.has(g)) groupMap.set(g, []);
            groupMap.get(g).push(song);
        });

        groupMap.forEach((songList, groupName) => {
            const groupEl = document.createElement('div');
            if (groupName !== '') {
                const label = document.createElement('div');
                label.className = 'year-label';
                label.textContent = groupName;
                groupEl.appendChild(label);
            }
            songList.forEach(song => {
                const item = document.createElement('div');
                item.className = 'song-item';
                item.textContent = song.name;
                const diffs = document.createElement('div');
                diffs.style.display = 'none';
                // file は string または string[] の両方を許容
                const files = Array.isArray(song.file) ? song.file : [song.file];
                item.onclick = async () => {
                    if (diffs.style.display === 'none') {
                        await loadDiffs(files, diffs);
                        diffs.style.display = 'block';
                    } else {
                        diffs.style.display = 'none';
                    }
                };
                groupEl.appendChild(item);
                groupEl.appendChild(diffs);
            });
            container.appendChild(groupEl);
        });
    } catch (e) { console.error('music_list.json の読み込みに失敗:', e); }
}

// ===== 譜面ファイルパース（共通） =====
// key=value|key=value|... 形式のテキストをオブジェクトに変換
function parseDosText(text) {
    const data = {};
    text.split('|').forEach(b => {
        const i = b.indexOf('=');
        if (i !== -1) data[b.substring(0, i).trim()] = b.substring(i + 1).trim();
    });
    return data;
}

// ===== 単一ファイル取得（UTF-8/Shift-JIS対応） =====
async function fetchDosFile(path) {
    const res = await fetch(path);
    const buf = await res.arrayBuffer();
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(buf); }
    catch { text = new TextDecoder('shift-jis').decode(buf); }
    return parseDosText(text);
}

// ===== dosNoヘッダーのパース =====
// 本体のdosNoヘッダー（譜面番号固定 externalDosLock 併用時に使う特殊指定）を解釈する。
// 書式: 改行区切りで「ファイル番号,そのファイル内でのsuffix番号」を譜面の数だけ列記。
//   例: "1,1\n1,2\n2,1" → 譜面0,1はファイル1(サフィックスなし)のsuffix1,2、譜面2はファイル2のsuffix1
// suffix番号を省略した行は、同じファイル番号内で自動的に連番が振られる
//   （本体のsetScoreIdHeader/setDosIdHeaderと同じ採番ルールを再現）
// 参考: https://github.com/cwtickle/danoniplus/wiki/AboutLoadingChart
function parseDosNo(rawDosNo) {
    const lines = rawDosNo.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
    const dosNos = [];
    const scoreNos = [];
    lines.forEach((line, j) => {
        const [d, s] = line.split(',').map(v => v !== undefined ? v.trim() : v);
        dosNos[j] = d;
        scoreNos[j] = s;
    });
    // suffix番号省略時の自動採番（ファイル番号ごとに1から連番）
    const dosNoCnt = {};
    dosNos.forEach((val, j) => {
        if (dosNoCnt[val] === undefined) dosNoCnt[val] = 0;
        if (scoreNos[j] === undefined) {
            dosNoCnt[val]++;
            scoreNos[j] = dosNoCnt[val];
        } else {
            dosNoCnt[val] = Number(scoreNos[j]);
        }
    });
    return { dosNos, scoreNos };
}

// ===== 譜面番号→(ファイルインデックス, データキーsuffix)のマッピング構築 =====
// dosNoヘッダーが無い場合: 譜面番号i（0始まり）→ ファイルi、suffix(i===0 ? '' : String(i+1))
//   というファイル順=譜面番号=suffixの単純対応（本体のscoreLockFlgなし時と同じ）
// dosNoヘッダーがある場合: dosNo/scoreNoの指定に従う（本体のscoreLockFlgあり時と同じ）
//   ファイルインデックスは「先頭ファイルからの相対位置」になるよう1始まりの値を0始まりに変換する
function buildScoreMap(difCount, rawDosNo) {
    const map = []; // map[scoreIndex] = { fileIndex, suffix }
    if (rawDosNo && rawDosNo.trim()) {
        const { dosNos, scoreNos } = parseDosNo(rawDosNo);
        for (let i = 0; i < difCount; i++) {
            const dosNo = Number(dosNos[i]);
            const scoreNo = Number(scoreNos[i]);
            // dosNo=1始まり想定のためファイル配列のインデックスは-1
            const fileIndex = (!isNaN(dosNo) && dosNo > 0) ? dosNo - 1 : 0;
            const suffix = (!isNaN(scoreNo) && scoreNo > 1) ? String(scoreNo) : '';
            map.push({ fileIndex, suffix });
        }
    } else {
        // dosNoなし：ファイル順=譜面番号=suffix の単純対応
        for (let i = 0; i < difCount; i++) {
            map.push({ fileIndex: i, suffix: i === 0 ? '' : String(i + 1) });
        }
    }
    return map;
}

// ===== 譜面ファイル読み込み・難易度リスト生成 =====
// files: string[]（1要素のみなら単一ファイル譜面、2要素以上ならファイル分割譜面）
async function loadDiffs(files, container) {
    // 全ファイルを並行取得
    const fileDataList = await Promise.all(files.map(f => fetchDosFile(f)));

    // difDataは「先頭ファイル（サフィックスなし）」にのみ存在する前提で読む
    // （本体仕様：2ファイル目以降はdifData省略可）
    const headerData = fileDataList[0];
    container.innerHTML = '';
    if (!headerData['difData']) return;

    const difLines = headerData['difData'].split(/\r?\n/).filter(l => l.trim() !== '');
    const scoreMap = buildScoreMap(difLines.length, headerData['dosNo']);

    difLines.forEach((line, i) => {
        const p = line.split(',');
        if (p.length < 2) return;
        const keyType = p[0] ? p[0].trim() : '7';
        const diffName = p[1] ? p[1].trim() : '';
        const btn = document.createElement('div');
        btn.textContent = ` └ [${keyType} key] ${diffName}`;
        btn.style.cssText = 'font-size:0.8em;padding:4px 20px;cursor:pointer;color:#888;';
        btn.onmouseenter = () => { btn.style.color = '#ccc'; };
        btn.onmouseleave = () => { btn.style.color = '#888'; };
        btn.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.diff-active').forEach(el => el.classList.remove('diff-active'));
            btn.classList.add('diff-active');
            btn.style.color = '#00ffcc';

            // この譜面番号が指すファイル・suffixを解決
            const { fileIndex, suffix } = scoreMap[i] || { fileIndex: 0, suffix: i === 0 ? '' : String(i + 1) };
            const targetData = fileDataList[fileIndex] || headerData;

            // 描画に使うデータは「対象ファイルのデータ」をベースに、
            // ヘッダー情報（setColor/frzColor等、◆以外の◆系ヘッダー）は先頭ファイルのものを補完する。
            // 本体仕様上、2ファイル目以降は◆以外のヘッダーが読込対象外になるため。
            state.fullData = Object.assign({}, headerData, targetData);
            state.currentSuffix = suffix;
            state.keyType = keyType;
            renderChart();
        };
        container.appendChild(btn);
    });
}

// ===== カラーパース =====
const parseColor = (val) => {
    if (!val) return '#ffffff';
    let c = val.trim().replace('0x', '#');
    if (c.startsWith('#') && (c.length === 7 || c.length === 4)) return c;
    return '#ffffff';
};

// ===== key_map.jsonからレーン設定を取得 =====
function getViewerLaneConfig(keyType) {
    const cfg = KEY_MAP[keyType];
    if (!cfg) return null;
    return cfg.lanes || null;
}

// ===== speed_dataパース & frameToY構築 =====
function buildFrameToY(fullData, suffix) {
    const s = suffix;
    const speedKey    = s === '' ? 'speed_data'   : `speed${s}_data`;
    const speedKeyAlt = s === '' ? 'speed_change'  : `speed${s}_change`;
    const raw = (fullData[speedKey]?.trim() ? fullData[speedKey] : fullData[speedKeyAlt]) || '';

    const segs = [];
    if (raw) {
        const vals = raw.split(',').map(v => v.trim()).filter(v => v !== '');
        for (let i = 0; i + 1 < vals.length; i += 2) {
            const sf = parseInt(vals[i]), sp = parseFloat(vals[i + 1]);
            if (!isNaN(sf) && !isNaN(sp)) segs.push({ frame: sf, speed: sp });
        }
        segs.sort((a, b) => a.frame - b.frame);
    }

    const frameToY = (frame) => {
        if (segs.length === 0 || !state.showSpeedInterval) return frame * state.zoom;
        // speed≦0は無視（マイナス・0スクロールは等間隔扱い）
        let dist = 0, prevF = 0, prevS = 1.0;
        for (const seg of segs) {
            if (frame <= seg.frame) break;
            const s = Math.max(0, seg.speed);
            dist += (seg.frame - prevF) * prevS;
            prevF = seg.frame; prevS = s > 0 ? s : prevS;
        }
        dist += (frame - prevF) * prevS;
        return dist * state.zoom;
    };

    return { frameToY, segs };
}

// ===== boost_dataパース =====
// boost_dataはframeToYに影響しない（静的表示への速度変化適用は意図しない動作を起こすため）
// 書式: Frame,Speed,Frame,Speed,... （speed_dataと同形式）
function parseBoostData(fullData, suffix) {
    const s = suffix;
    const key = s === '' ? 'boost_data' : `boost${s}_data`;
    const raw = fullData[key]?.trim() || '';
    if (!raw) return [];

    const segs = [];
    const vals = raw.split(',').map(v => v.trim()).filter(v => v !== '');
    for (let i = 0; i + 1 < vals.length; i += 2) {
        const sf = parseInt(vals[i]), sp = parseFloat(vals[i + 1]);
        if (!isNaN(sf) && !isNaN(sp)) segs.push({ frame: sf, speed: sp });
    }
    return segs.sort((a, b) => a.frame - b.frame);
}

// ===== ncolor_dataパーサー =====
function parseNColorData(rawText) {
    if (!rawText) return [];
    const timeline = [];
    const allTokens = [];
    for (const line of rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l)) {
        allTokens.push(...line.split(',').map(t => t.trim()).filter(t => t));
    }
    for (let i = 0; i + 2 < allTokens.length; i += 3) {
        const frameStr = allTokens[i], keySpec = allTokens[i + 1], colorStr = allTokens[i + 2];
        if (colorStr === 'all' || colorStr === 'ALL') { i -= 2; continue; }
        const frame = parseInt(frameStr);
        if (isNaN(frame) || keySpec === '-') continue;
        const color = parseColor(colorStr);
        const [keysRaw, patternRaw] = keySpec.split(':');
        const pattern = patternRaw ? patternRaw.trim() : '';
        const kr = keysRaw.trim();
        let colorNoSpec;
        if (kr === 'all' || kr === 'ALL') {
            colorNoSpec = { type: 'all' };
        } else if (/^g\d+$/.test(kr)) {
            colorNoSpec = { type: 'group', values: [parseInt(kr.slice(1)) + 1] };
        } else if (kr.includes('/')) {
            const vals = kr.split('/').map(v => v.trim());
            colorNoSpec = vals[0].startsWith('g')
                ? { type: 'group', values: vals.map(v => parseInt(v.slice(1)) + 1) }
                : { type: 'laneNum', values: vals.map(Number) };
        } else if (kr.includes('...')) {
            const [start, end] = kr.split('...').map(Number);
            const vals = []; for (let j = start; j <= end; j++) vals.push(j);
            colorNoSpec = { type: 'laneNum', values: vals };
        } else {
            const n = Number(kr);
            colorNoSpec = isNaN(n) ? null : { type: 'laneNum', values: [n] };
        }
        if (!colorNoSpec) continue;
        timeline.push({ frame, colorNoSpec, pattern, color });
    }
    return timeline.sort((a, b) => a.frame - b.frame);
}

function bisectRight(timeline, frame) {
    let lo = 0, hi = timeline.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (timeline[mid].frame <= frame) lo = mid + 1; else hi = mid; }
    return lo;
}

function getNoteColor(timeline, frame, keyId, colorGrp, part, baseColor) {
    if (!timeline || timeline.length === 0) return baseColor;
    let activeColor = baseColor;
    const end = bisectRight(timeline, frame);
    for (let i = 0; i < end; i++) {
        const { colorNoSpec, pattern, color } = timeline[i];
        let matches = false;
        if (colorNoSpec.type === 'all') matches = true;
        else if (colorNoSpec.type === 'group') matches = colorNoSpec.values.includes(colorGrp);
        else if (colorNoSpec.type === 'laneNum') matches = colorNoSpec.values.includes(keyId);
        if (!matches) continue;
        const p = pattern.toUpperCase();
        if (part === 'NormalArrow') {
            if (p === '' || p === 'ARROW' || p === 'AR' || p === 'AF') activeColor = color;
        } else if (part === 'FrzArrow') {
            if (['NORMAL','NA','FRZNORMAL','FN','FRZ','AF'].includes(p)) activeColor = color;
        } else if (part === 'FrzBar') {
            if (['NORMALBAR','NB','FRZNORMAL','FN','FRZ','AF'].includes(p)) activeColor = color;
        }
    }
    return activeColor;
}

// ===== ノート要素生成 =====
function createNoteEl(laneObj, frame, color, y) {
    const el = document.createElement('div');
    el.className = 'note-container';
    const angle = laneObj.viewAngle || 0;
    const imgName = laneObj.viewImg || 'arrow';
    const revCancel = state.isReverse ? ' scaleY(-1)' : '';
    el.dataset.angle = angle;
    el.style.cssText = [
        `top:${y}px`,
        `width:${NOTE_SIZE}px`,
        `height:${NOTE_SIZE}px`,
        `transform:translateY(-50%)${revCancel} rotate(${angle}deg)`,
        `background:${color}`,
        `-webkit-mask-image:url("${CONFIG.IMG_DIR}/${imgName}.png")`,
        `mask-image:url("${CONFIG.IMG_DIR}/${imgName}.png")`,
        '-webkit-mask-size:contain',
        'mask-size:contain',
        '-webkit-mask-repeat:no-repeat',
        'mask-repeat:no-repeat',
        '-webkit-mask-position:center',
        'mask-position:center',
        'position:absolute',
        'pointer-events:none',
        'z-index:5',
    ].join(';');
    return el;
}

// ===== 譜面描画 =====
function renderChart() {
    const area = document.getElementById('chart-area');
    if (!state.fullData['difData']) return;

    area.innerHTML = '';
    area.style.transform = state.isReverse ? 'scaleY(-1)' : '';

    const lanes = getViewerLaneConfig(state.keyType);
    if (!lanes) return;

    const s = state.currentSuffix;
    const colors = (state.fullData['setColor'] || '').split(',').map(parseColor);
    const fClr   = (state.fullData['frzColor']  || '').split(',').map(parseColor);

    // ncolor_data（参照コピー対応）
    const resolveRef = (key) => {
        const val = state.fullData[key];
        if (!val) return '';
        const trimmed = val.trim();
        return state.fullData[trimmed] !== undefined ? state.fullData[trimmed] : val;
    };
    const nColorTimeline = parseNColorData(resolveRef(s === '' ? 'ncolor_data' : `ncolor${s}_data`));

    // speed_data
    const { frameToY, segs: speedSegs } = buildFrameToY(state.fullData, s);
    state.frameToY = frameToY;

    // boost_data（frameToYには影響しない）
    const boostSegs = parseBoostData(state.fullData, s);

    // 最大フレーム計算
    state.maxFrame = 0;
    lanes.forEach(laneObj => {
        const nk = `${laneObj.lane}${s}_data`;
        const fk = `${laneObj.frz}${s}_data`;
        [nk, fk].forEach(key => {
            if (state.fullData[key]) {
                state.fullData[key].split(',').filter(v => v.trim()).forEach(f => {
                    state.maxFrame = Math.max(state.maxFrame, Number(f));
                });
            }
        });
    });

    const maxY = frameToY(state.maxFrame);
    area.style.width  = (lanes.length * LANE_WIDTH + 120) + 'px'; // 120=速度ラベル列の余白
    area.style.height = (maxY + CHART_PADDING_BOTTOM) + 'px';

    const fragment = document.createDocumentFragment();

    // ノート描画
    lanes.forEach((laneObj, idx) => {
        const colorGrp = laneObj.viewColorGrp ?? 1;
        const keyId    = laneObj.laneNum !== undefined ? laneObj.laneNum : idx;
        const nk = `${laneObj.lane}${s}_data`;
        const fk = `${laneObj.frz}${s}_data`;
        const defaultColor    = colors[colorGrp] ?? '#ffffff';
        const defaultFrzColor = fClr[0] || '#ffffff';
        const defaultBarColor = fClr[1] || 'rgba(0,255,204,0.3)';

        // フリーズ
        if (state.fullData[fk]) {
            const fd = state.fullData[fk].split(',').filter(v => v.trim()).map(Number);
            for (let i = 0; i + 1 < fd.length; i += 2) {
                if (isNaN(fd[i]) || isNaN(fd[i + 1])) continue;
                const startF = fd[i], endF = fd[i + 1];
                const yS = frameToY(startF), yE = frameToY(endF);
                const headColor = getNoteColor(nColorTimeline, startF, keyId, colorGrp, 'FrzArrow', defaultFrzColor);
                const barColor  = getNoteColor(nColorTimeline, startF, keyId, colorGrp, 'FrzBar',   defaultBarColor);
                const tailColor = getNoteColor(nColorTimeline, endF,   keyId, colorGrp, 'FrzArrow', defaultFrzColor);
                const bar = document.createElement('div');
                bar.className = 'frz-bar';
                // フリーズバーはレーン中央に12px幅で配置。左オフセット=(LANE_WIDTH-12)/2=14
                bar.style.cssText = `top:${yS}px;height:${yE - yS}px;left:${idx * LANE_WIDTH + 14}px;width:12px;background:${barColor};border:1px solid ${headColor};position:absolute;z-index:2;pointer-events:none;box-sizing:border-box;opacity:0.7;`;
                fragment.appendChild(bar);
                const headEl = createNoteEl(laneObj, startF, headColor, yS);
                headEl.style.left = (idx * LANE_WIDTH) + 'px';
                fragment.appendChild(headEl);
                const tailEl = createNoteEl(laneObj, endF, tailColor, yE);
                tailEl.style.left = (idx * LANE_WIDTH) + 'px';
                fragment.appendChild(tailEl);
            }
        }

        // 通常ノート
        if (state.fullData[nk]) {
            state.fullData[nk].split(',').filter(v => v.trim()).forEach(f => {
                const frame = Number(f);
                const noteColor = getNoteColor(nColorTimeline, frame, keyId, colorGrp, 'NormalArrow', defaultColor);
                const el = createNoteEl(laneObj, frame, noteColor, frameToY(frame));
                el.style.left = (idx * LANE_WIDTH) + 'px';
                fragment.appendChild(el);
            });
        }
    });

    const chartW = lanes.length * LANE_WIDTH;
    const revCancel = state.isReverse ? ' scaleY(-1)' : '';

    // speed_dataラベル・横線
    if (speedSegs.length > 0) {
        speedSegs.forEach(seg => {
            const y = frameToY(seg.frame);
            const label = document.createElement('div');
            label.className = 'speed-label';
            label.style.cssText = `position:absolute;top:${y}px;left:${chartW + 4}px;transform:translateY(-50%)${revCancel};font-size:10px;color:${SPEED_LABEL_COLOR};white-space:nowrap;pointer-events:none;z-index:10;font-family:monospace;`;
            label.textContent = `x${seg.speed.toFixed(2)}`;
            fragment.appendChild(label);
            const line = document.createElement('div');
            line.style.cssText = `position:absolute;top:${y}px;left:0;width:${chartW}px;border-top:1px dashed ${SPEED_LINE_COLOR};pointer-events:none;z-index:3;`;
            fragment.appendChild(line);
        });
    }

    // boost_dataラベル・横線
    // ※ frameToYには影響しない。速度変化はゲーム側の動的表示用のため静的表示には適用しない
    if (boostSegs.length > 0) {
        // speed_dataラベルが存在する場合はその右、なければspeedラベル位置と同じ列に表示
        const boostLabelLeft = speedSegs.length > 0 ? chartW + 54 : chartW + 4;
        boostSegs.forEach(seg => {
            const y = frameToY(seg.frame);
            const label = document.createElement('div');
            label.className = 'boost-label';
            label.style.cssText = `position:absolute;top:${y}px;left:${boostLabelLeft}px;transform:translateY(-50%)${revCancel};font-size:10px;color:${BOOST_LABEL_COLOR};white-space:nowrap;pointer-events:none;z-index:10;font-family:monospace;`;
            label.textContent = `B${seg.speed.toFixed(2)}`;
            fragment.appendChild(label);
            const line = document.createElement('div');
            line.style.cssText = `position:absolute;top:${y}px;left:0;width:${chartW}px;border-top:1px dashed ${BOOST_LINE_COLOR};pointer-events:none;z-index:3;`;
            fragment.appendChild(line);
        });
    }

    area.appendChild(fragment);
    drawMinimap(lanes, colors, fClr, nColorTimeline, speedSegs);
}

// ===== ミニマップ描画 =====
function drawMinimap(lanes, colors, fClr, nColorTimeline = [], speedSegs = []) {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas || !lanes) return;
    const ctx = canvas.getContext('2d');
    const h = canvas.height = window.innerHeight;
    const w = canvas.width = canvas.offsetWidth || 80;
    if (state.maxFrame <= 0) return;

    const s = state.currentSuffix;
    const laneW = w / lanes.length;
    ctx.clearRect(0, 0, w, h);

    // speed_dataによる正規化
    function frameToRatio(frame) {
        if (speedSegs.length === 0 || !state.showSpeedInterval) return frame / state.maxFrame;
        const maxY = state.frameToY(state.maxFrame);
        return maxY > 0 ? state.frameToY(frame) / maxY : frame / state.maxFrame;
    }

    lanes.forEach((laneObj, idx) => {
        const colorGrp = laneObj.viewColorGrp ?? 1;
        const keyId    = laneObj.laneNum !== undefined ? laneObj.laneNum : idx;
        const nk = `${laneObj.lane}${s}_data`;
        const fk = `${laneObj.frz}${s}_data`;
        const baseColor = colors[colorGrp] ?? '#ffffff';
        const frzBarColor = fClr[1] || 'rgba(0,255,204,0.3)';

        if (state.fullData[fk]) {
            const fd = state.fullData[fk].split(',').filter(v => v.trim()).map(Number);
            for (let i = 0; i + 1 < fd.length; i += 2) {
                const yS = frameToRatio(fd[i]) * h;
                const yE = frameToRatio(fd[i + 1]) * h;
                ctx.fillStyle = frzBarColor;
                ctx.fillRect(idx * laneW + 1, state.isReverse ? h - yE : yS, laneW - 2, Math.abs(yE - yS));
            }
        }

        if (state.fullData[nk]) {
            state.fullData[nk].split(',').filter(v => v.trim()).forEach(f => {
                const frame = Number(f);
                const y = frameToRatio(frame) * h;
                const nc = getNoteColor(nColorTimeline, frame, keyId, colorGrp, 'NormalArrow', baseColor);
                ctx.fillStyle = nc;
                ctx.fillRect(idx * laneW, state.isReverse ? h - y : y, laneW - 1, 1);
            });
        }
    });
}
