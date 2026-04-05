'use strict';

const ASSETS = {
    arrow: "data:image/png;base64,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",
    onigiri: "data:image/png;base64,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"
};

const LANES = [
    { key: 'left',     frz: 'frzLeft',  img: 'arrow',   angle: 0,   colorGrp: 1, flip: false },
    { key: 'leftdia',  frz: 'frzLdia',  img: 'arrow',   angle: -45, colorGrp: 2, flip: false },
    { key: 'down',     frz: 'frzDown',  img: 'arrow',   angle: -90, colorGrp: 1, flip: false },
    { key: 'space',    frz: 'frzSpace', img: 'onigiri', angle: 0,   colorGrp: 2, flip: false },
    { key: 'up',       frz: 'frzUp',    img: 'arrow',   angle: 90,  colorGrp: 1, flip: false },
    { key: 'rightdia', frz: 'frzRdia',  img: 'arrow',   angle: 135, colorGrp: 2, flip: false },
    { key: 'right',    frz: 'frzRight', img: 'arrow',   angle: 0,   colorGrp: 1, flip: true }
];

let state = { fullData: {}, zoom: 5.0, currentSuffix: '', maxFrame: 0 };

window.addEventListener('DOMContentLoaded', () => {
    loadSongList();
    document.getElementById('zoom-slider').oninput = (e) => {
        state.zoom = parseFloat(e.target.value);
        document.getElementById('zoom-val').innerText = `x${state.zoom.toFixed(1)}`;
        renderChart();
    };
});

// 色のパース
const parseColor = (val) => {
    if (!val) return '#ffffff';
    let c = val.trim().replace('0x', '#');
    return (c.length === 7 || c.length === 4) ? c : '#ffffff';
};

// 1. 譜面リストの取得
async function loadSongList() {
    console.log("Attempting to load music_list.json...");
    try {
        const response = await fetch('music_list.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        console.log("Successfully loaded song list:", data);
        renderSongList(data);
    } catch (e) {
        console.error("Critical Error in loadSongList:", e);
        document.getElementById('song-list').innerHTML = `<div style="color:red; padding:10px;">Load Failed:<br>${e.message}</div>`;
    }
}

// リストのUI描画 (絵文字削除 & 構造最適化版)
function renderSongList(data) {
    const container = document.getElementById('song-list');
    if (!container) return; 
    container.innerHTML = '';

    const years = Object.keys(data).sort((a, b) => b - a);

    years.forEach(year => {
        const yearGroup = document.createElement('div');
        yearGroup.className = 'year-group';
        yearGroup.innerHTML = `<div class="year-label">${year}</div>`;
        
        data[year].forEach(song => {
            const songContainer = document.createElement('div');
            songContainer.style.margin = "5px 0";

            // 曲名表示 (「??」の原因だった絵文字を削除)
            const songNameEl = document.createElement('div');
            songNameEl.className = 'song-item';
            songNameEl.innerText = song.name; // ここを修正
            
            const diffContainer = document.createElement('div');
            diffContainer.style.cssText = "margin-left: 15px; border-left: 1px solid #444; padding-left: 5px; display:none;"; 

            songNameEl.onclick = async () => {
                const isExpanded = diffContainer.style.display === 'block';
                diffContainer.style.display = isExpanded ? 'none' : 'block';
                
                document.querySelectorAll('.song-item').forEach(el => el.classList.remove('active'));
                if (!isExpanded) {
                    songNameEl.classList.add('active');
                    if (diffContainer.innerHTML === '') {
                        await loadChartForDiffs(`${year}/${song.file}`, diffContainer);
                    }
                }
            };

            songContainer.appendChild(songNameEl);
            songContainer.appendChild(diffContainer);
            yearGroup.appendChild(songContainer);
        });
        container.appendChild(yearGroup);
    });
}

// 難易度リスト表示用の特別読込
async function loadChartForDiffs(path, container) {
    try {
        const res = await fetch(path);
        const text = await res.text();
        const tempData = {};
        text.split('|').forEach(block => {
            const eqIdx = block.indexOf('=');
            if (eqIdx !== -1) tempData[block.substring(0, eqIdx).trim()] = block.substring(eqIdx + 1).trim();
        });

        // 難易度ボタンの作成
        container.innerHTML = '';
        if (tempData['difData']) {
            tempData['difData'].split(/\r?\n/).forEach((line, i) => {
                const parts = line.split(',');
                if (parts.length < 2) return;
                
                const dBtn = document.createElement('div');
                dBtn.innerText = `└ ${parts[1]}`;
                dBtn.style.cssText = "font-size:0.85em; padding:4px; cursor:pointer; color:#aaa;";
                dBtn.onmouseover = () => dBtn.style.color = "#fff";
                dBtn.onmouseout = () => { if(!dBtn.classList.contains('active')) dBtn.style.color = "#aaa"; };
                
                dBtn.onclick = (e) => {
                    e.stopPropagation(); // 親の曲名クリックイベントを防ぐ
                    document.querySelectorAll('.diff-btn-active').forEach(el => {
                        el.classList.remove('diff-btn-active');
                        el.style.color = "#aaa";
                    });
                    dBtn.classList.add('diff-btn-active');
                    dBtn.style.color = "var(--accent)";
                    
                    // 実際に譜面を描画
                    state.fullData = tempData;
                    state.currentSuffix = (i === 0) ? '' : (i + 1).toString();
                    renderChart();
                };
                container.appendChild(dBtn);
            });
        }
    } catch (e) {
        container.innerHTML = '<div style="font-size:10px; color:red;">Failed to load.</div>';
    }
}

// 3. 譜面データの読み込み
async function loadChartData(path) {
    console.log(`Loading chart: ${path}`);
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Chart not found: ${path}`);
        const text = await res.text();
        parseChart(text);
    } catch (e) {
        console.error(e);
        alert(e.message);
    }
}

function parseChart(content) {
    state.fullData = {};
    content.split('|').forEach(block => {
        const eqIdx = block.indexOf('=');
        if (eqIdx !== -1) {
            state.fullData[block.substring(0, eqIdx).trim()] = block.substring(eqIdx + 1).trim();
        }
    });
    setupDiffButtons();
    state.currentSuffix = '';
    renderChart();
}

function setupDiffButtons() {
    const container = document.getElementById('diff-buttons');
    container.innerHTML = '';
    if (!state.fullData['difData']) return;

    state.fullData['difData'].split(/\r?\n/).forEach((line, i) => {
        const parts = line.split(',');
        if (parts.length < 2) return;
        const btn = document.createElement('button');
        btn.className = (i === 0) ? 'active' : '';
        btn.innerText = parts[1];
        btn.onclick = () => {
            document.querySelectorAll('#diff-buttons button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentSuffix = (i === 0) ? '' : (i + 1).toString();
            renderChart();
        };
        container.appendChild(btn);
    });
}

function createNoteEl(lane, frame, color) {
    const el = document.createElement('div');
    el.className = 'note-container'; 
    
    const img = ASSETS[lane.img];
    let transform = `translateY(-50%) rotate(${lane.angle}deg)`;
    if (lane.flip) transform += ` scaleX(-1)`;
    
    // 修正ポイント: mask-image の指定を url("${img}") に統一し、
    // 背景色が確実にマスクされるように設定を整理します。
    el.style.cssText = `
        top: ${frame * state.zoom}px; 
        left: ${LANES.indexOf(lane) * 45}px; 
        transform: ${transform}; 
        background-color: ${color}; 
        width: 40px;
        height: 40px;
        -webkit-mask-image: url("${img}");
        mask-image: url("${img}");
        -webkit-mask-size: contain;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-position: center;
        mask-position: center;
    `;
    return el;
}

function renderChart() {
    const area = document.getElementById('chart-area');
    if (!area) return; // エラー防止
    area.innerHTML = '';
    state.maxFrame = 0;

    const s = state.currentSuffix;
    const setColors = (state.fullData['setColor'] || '').split(',').map(parseColor);
    const frzColors = (state.fullData['frzColor'] || '').split(',').map(parseColor);

    const cNormal1 = setColors[0] || '#ffffff';
    const cNormal2 = setColors[1] || '#ffffff';
    const cFrzArrow = frzColors[0] || '#ffffff';
    const cFrzBar = frzColors[1] || 'rgba(0, 255, 204, 0.5)';

    LANES.forEach((lane, idx) => {
        const noteKey = `${lane.key}${s}_data`;
        const frzKey = `${lane.frz}${s}_data`;
        const noteColor = (lane.colorGrp === 1) ? cNormal1 : cNormal2;

        if (state.fullData[frzKey]) {
            const fData = state.fullData[frzKey].split(',').filter(v => v !== '').map(Number);
            for (let i = 0; i < fData.length; i += 2) {
                const start = fData[i], end = fData[i+1];
                if (isNaN(start) || isNaN(end)) continue;
                state.maxFrame = Math.max(state.maxFrame, end);
                const bar = document.createElement('div');
                bar.className = 'frz-bar';
                bar.style.cssText = `top:${start * state.zoom}px; height:${(end - start) * state.zoom}px; left:${idx * 45 + 12}px; background:${cFrzBar}; border:1px solid ${cFrzArrow};`;
                area.appendChild(bar);
                area.appendChild(createNoteEl(lane, start, cFrzArrow));
                area.appendChild(createNoteEl(lane, end, cFrzArrow));
            }
        }

        if (state.fullData[noteKey]) {
            state.fullData[noteKey].split(',').filter(v => v !== '').forEach(fStr => {
                const f = Number(fStr);
                if (!isNaN(f)) {
                    state.maxFrame = Math.max(state.maxFrame, f);
                    area.appendChild(createNoteEl(lane, f, noteColor));
                }
            });
        }
    });

    area.style.height = (state.maxFrame * state.zoom + 800) + 'px';
    drawMinimap(s, cNormal1, cNormal2, cFrzBar);
}

function drawMinimap(suffix, c1, c2, cb) {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const h = window.innerHeight;
    const w = canvas.width = 80;
    canvas.height = h;
    
    if (state.maxFrame <= 0) return;
    const laneW = w / LANES.length;

    LANES.forEach((lane, idx) => {
        const nKey = `${lane.key}${suffix}_data`;
        const fKey = `${lane.frz}${suffix}_data`;
        if (state.fullData[fKey]) {
            ctx.fillStyle = cb;
            const fd = state.fullData[fKey].split(',').filter(v => v !== '').map(Number);
            for (let i = 0; i < fd.length; i += 2) {
                ctx.fillRect(idx * laneW + 2, (fd[i]/state.maxFrame)*h, laneW-4, ((fd[i+1]-fd[i])/state.maxFrame)*h);
            }
        }
        if (state.fullData[nKey]) {
            ctx.fillStyle = (lane.colorGrp === 1) ? c1 : c2;
            state.fullData[nKey].split(',').filter(v => v !== '').forEach(f => {
                ctx.fillRect(idx * laneW + 1, (Number(f)/state.maxFrame)*h, laneW-2, 1);
            });
        }
    });
}