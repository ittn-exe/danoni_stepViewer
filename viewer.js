'use strict';

const ASSETS = {
    arrow: "data:image/png;base64,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",
    onigiri: "data:image/png;base64,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"
};

let config = { laneMaster: {}, keyConfigs: {} };
let state = { fullData: {}, zoom: 5.0, currentSuffix: '', maxFrame: 0, isReverse: false };

window.addEventListener('DOMContentLoaded', async () => {
    await loadConfig();
    loadSongList();
    
    document.getElementById('zoom-slider').oninput = (e) => {
        state.zoom = parseFloat(e.target.value);
        document.getElementById('zoom-val').innerText = `x${state.zoom.toFixed(1)}`;
        renderChart();
    };

    document.getElementById('rev-toggle').onclick = () => {
        state.isReverse = !state.isReverse;
        document.getElementById('rev-toggle').innerText = `REVERSE: ${state.isReverse ? 'ON' : 'OFF'}`;
        document.getElementById('rev-toggle').classList.toggle('active', state.isReverse);
        renderChart();
    };

    const mainView = document.getElementById('main-view');
    const indicator = document.getElementById('view-indicator');
    if (mainView && indicator) {
        mainView.addEventListener('scroll', () => {
            const scrollPercent = mainView.scrollTop / (mainView.scrollHeight - mainView.clientHeight);
            const viewPercent = mainView.clientHeight / mainView.scrollHeight;
            indicator.style.top = (scrollPercent * (100 - (viewPercent * 100))) + "%";
            indicator.style.height = (viewPercent * 100) + "%";
        });
    }

// ミニマップクリックでジャンプする機能
    const minimap = document.getElementById('minimap-canvas');

    if (minimap && mainView) {
        minimap.onclick = (e) => {
            if (state.maxFrame <= 0) return;

            const rect = minimap.getBoundingClientRect();
            // クリックされた位置の割合（上端が0.0、下端が1.0）
            const ratio = (e.clientY - rect.top) / rect.height;

            // メインビューの全高さ（スクロール範囲）に対して、クリック位置をそのまま適用
            // これにより、REVERSEかどうかにかかわらず「見たままの位置」のピクセル座標が出る
            const scrollPos = mainView.scrollHeight * ratio;
            
            mainView.scrollTo({
                // 中央付近に来るように調整
                top: scrollPos - (mainView.clientHeight / 2),
                behavior: 'auto' // 動作確認中は auto の方がズレが分かりやすくておすすめ
            });
        };
    }
});

async function loadConfig() {
    try {
        const res = await fetch('config.json');
        config = await res.json();
    } catch (e) { console.error("Config failed", e); }
}

const parseColor = (val) => {
    if (!val) return '#ffffff';
    let c = val.trim().replace('0x', '#');
    return (c.length === 7 || c.length === 4) ? c : '#ffffff';
};

async function loadSongList() {
    const res = await fetch('music_list.json');
    const data = await res.json();
    const container = document.getElementById('song-list');
    Object.keys(data).sort((a,b)=>b-a).forEach(year => {
        const group = document.createElement('div');
        group.innerHTML = `<div class="year-label">${year}</div>`;
        data[year].forEach(song => {
            const item = document.createElement('div');
            item.className = 'song-item';
            item.innerText = song.name;
            const diffs = document.createElement('div');
            diffs.style.display = 'none';
            item.onclick = async () => {
                if(diffs.style.display === 'none') {
                    await loadDiffs(`${year}/${song.file}`, diffs);
                    diffs.style.display = 'block';
                } else {
                    diffs.style.display = 'none';
                }
            };
            group.appendChild(item);
            group.appendChild(diffs);
        });
        container.appendChild(group);
    });
}

async function loadDiffs(path, container) {
    const res = await fetch(path);
    const text = await res.text();
    const data = {};
    text.split('|').forEach(b => {
        const i = b.indexOf('=');
        if(i!==-1) data[b.substring(0,i).trim()] = b.substring(i+1).trim();
    });
    container.innerHTML = '';
    data['difData'].split(/\r?\n/).forEach((line, i) => {
        const p = line.split(',');
        if(p.length < 2) return;
        
        //キー種取得
        const keyType = p[0] ? `[${p[0].toUpperCase()} key] ` : '';
        const diffName = p[1];
        
        const b = document.createElement('div');
        b.innerText = ` └ ${keyType}${diffName}`;
        b.style.cssText = "font-size:0.8em; padding:4px 20px; cursor:pointer; color:#888;";
        
        b.onclick = (e) => {
            e.stopPropagation();
            state.fullData = data;
            state.currentSuffix = i === 0 ? '' : (i+1).toString();
            renderChart();
        };
        container.appendChild(b);
    });
}

function createNoteEl(lane, frame, color, idx) {
    const el = document.createElement('div');
    el.className = 'note-container';
    const m = config.laneMaster[lane];
    const y = state.isReverse ? (state.maxFrame - frame) * state.zoom : frame * state.zoom;
    let t = `translateY(-50%) rotate(${m.angle}deg)`;
    if(m.flip) t += ` scaleX(-1)`;
    el.style.cssText = `top:${y}px; left:${idx*45}px; transform:${t}; background:${color}; -webkit-mask-image:url("${ASSETS[m.img]}"); mask-image:url("${ASSETS[m.img]}"); -webkit-mask-size:contain; mask-size:contain;`;
    return el;
}

/**
 * 譜面データからフリーズアローのキー名を取得する
 */
function getFrzKeyName(key, suffix) {
    if (!key) return '';
    const k = key.toLowerCase();
    
    // 1. 11key拡張分 (sleft, sdown, sup, sright)
    if (k.startsWith('s') && k !== 'space') {
        const direction = k.slice(1); // "left" 等
        return `sfrz${direction.charAt(0).toUpperCase() + direction.slice(1)}${suffix}_data`;
    }

    // 2. スペース（おにぎり）
    if (k === 'space') {
        return `frzSpace${suffix}_data`;
    }

    // 3. 特殊な斜め矢印の名称変換
    let fkName = key;
    if (k === 'leftdia') fkName = 'Ldia';
    if (k === 'rightdia') fkName = 'Rdia';

    // 4. 通常の矢印 (頭文字を大文字にする)
    const name = fkName.charAt(0).toUpperCase() + fkName.slice(1);
    return `frz${name}${suffix}_data`;
}

function renderChart() {
    const area = document.getElementById('chart-area');
    if (!state.fullData['difData']) return;
    
    // difDataの全行を取得
    const difLines = state.fullData['difData'].split(/\r?\n/);
    
    // 現在選択されている譜面が何行目か判定（空なら1行目、2以降ならその数値-1）
    const lineIndex = state.currentSuffix === '' ? 0 : parseInt(state.currentSuffix) - 1;
    
    // 該当する行のデータを取得し、その1番目の項目（キー数）を取り出す[cite: 4]
    const currentLine = difLines[lineIndex] || difLines[0];
    const type = currentLine.split(',')[0] || '7';
    
    // 決定したキー数に基づいて設定を読み込む[cite: 4]
    const cfg = config.keyConfigs[type] || config.keyConfigs['7'];
    
    area.style.width = (cfg.length * 45) + 'px';
    area.innerHTML = '';
    
    state.maxFrame = 0;
    const s = state.currentSuffix;
    const colors = (state.fullData['setColor']||'').split(',').map(parseColor);
    const fClr = (state.fullData['frzColor']||'').split(',').map(parseColor);

    // 1. 最大フレーム数を計算
    cfg.forEach(([key]) => {
        const nk = `${key.toLowerCase()}${s}_data`;
        const fk = getFrzKeyName(key, s);

        if(state.fullData[nk]) {
            state.fullData[nk].split(',').filter(v => v.trim() !== '').forEach(f => {
                state.maxFrame = Math.max(state.maxFrame, Number(f));
            });
        }
        if(state.fullData[fk]) {
            state.fullData[fk].split(',').filter(v => v.trim() !== '').forEach(f => {
                state.maxFrame = Math.max(state.maxFrame, Number(f));
            });
        }
    });

    // 2. 描画ループ
    cfg.forEach(([key, cIdx], idx) => {
        const nk = `${key.toLowerCase()}${s}_data`;
        const fk = getFrzKeyName(key, s);

        // フリーズアローの描画
        if(state.fullData[fk]) {
            const fd = state.fullData[fk].split(',').filter(v => v.trim() !== '').map(Number);
            for(let i=0; i<fd.length; i+=2) {
                if (isNaN(fd[i]) || isNaN(fd[i+1])) continue;
                const startF = fd[i];
                const endF = fd[i+1];
                const yS = state.isReverse ? (state.maxFrame - endF) * state.zoom : startF * state.zoom;
                
                const bar = document.createElement('div');
                bar.className = 'frz-bar';
                bar.style.cssText = `top:${yS}px; height:${(endF-startF)*state.zoom}px; left:${idx*45+12}px; background:${fClr[1]||'rgba(0,255,204,0.3)'}; border:1px solid ${fClr[0]||'#fff'};`;
                area.appendChild(bar);
                
                area.appendChild(createNoteEl(key, startF, fClr[0]||'#fff', idx));
                area.appendChild(createNoteEl(key, endF, fClr[0]||'#fff', idx));
            }
        }

        // 通常ノーツの描画
        if(state.fullData[nk]) {
            state.fullData[nk].split(',').filter(v => v.trim() !== '').forEach(f => {
                area.appendChild(createNoteEl(key, Number(f), colors[cIdx]||'#fff', idx));
            });
        }
    });

    area.style.height = (state.maxFrame * state.zoom + 800) + 'px';
    drawMinimap(cfg, colors);
}

function drawMinimap(cfg, colors) {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const h = canvas.height = window.innerHeight;
    const w = canvas.width = 80;
    if (state.maxFrame <= 0) return;
    
    const laneW = w / cfg.length;
    const s = state.currentSuffix;
    const fClr = (state.fullData['frzColor'] || '').split(',').map(parseColor);

    ctx.clearRect(0, 0, w, h);

    cfg.forEach(([key, cIdx], idx) => {
        const nk = `${key.toLowerCase()}${s}_data`;
        const fk = getFrzKeyName(key, s);

        if (state.fullData[fk]) {
            ctx.fillStyle = fClr[1] || 'rgba(0, 255, 204, 0.3)';
            const fd = state.fullData[fk].split(',').filter(v => v.trim() !== '').map(Number);
            for (let i = 0; i < fd.length; i += 2) {
                const yStart = (fd[i] / state.maxFrame) * h;
                const yEnd = (fd[i+1] / state.maxFrame) * h;
                const drawY = state.isReverse ? h - yEnd : yStart;
                const drawH = Math.abs(yEnd - yStart);
                ctx.fillRect(idx * laneW + 2, drawY, laneW - 4, drawH);
            }
        }

        if (state.fullData[nk]) {
            ctx.fillStyle = colors[cIdx] || '#fff';
            state.fullData[nk].split(',').filter(v => v.trim() !== '').forEach(f => {
                const y = (Number(f) / state.maxFrame) * h;
                ctx.fillRect(idx * laneW, state.isReverse ? h - y : y, laneW - 1, 1);
            });
        }
    });
}