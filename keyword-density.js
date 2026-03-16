(function() {
    var inputEl = document.getElementById('kdcInput');
    var statsEl = document.getElementById('kdcStats');
    var tableWrapEl = document.getElementById('kdcTableWrap');
    var analyzeBtn = document.getElementById('kdcAnalyze');
    var clearBtn = document.getElementById('kdcClear');
    var sortCol = 1;
    var sortAsc = false;
    var lastData = null;

    var STOP_WORDS = {
        a:1, an:1, the:1, and:1, or:1, but:1, in:1, on:1, at:1, to:1, for:1,
        of:1, with:1, by:1, from:1, is:1, are:1, was:1, were:1, be:1, been:1,
        being:1, have:1, has:1, had:1, do:1, does:1, did:1, will:1, would:1,
        could:1, should:1, may:1, might:1, shall:1, can:1, it:1, its:1, this:1,
        that:1, these:1, those:1, i:1, you:1, he:1, she:1, we:1, they:1, not:1,
        as:1, if:1, so:1, up:1, out:1, my:1, your:1, his:1, her:1, our:1, their:1
    };

    function analyze() {
        if (!inputEl) return;
        var text = inputEl.value;
        var words = text.toLowerCase().match(/\b[a-z]{2,}\b/g);
        if (!words || words.length === 0) {
            if (statsEl) statsEl.innerHTML = '';
            if (tableWrapEl) tableWrapEl.innerHTML = '';
            return;
        }
        var total = words.length;
        var freq = {};
        for (var i = 0; i < words.length; i++) {
            var w = words[i];
            if (STOP_WORDS[w]) continue;
            freq[w] = (freq[w] || 0) + 1;
        }
        var unique = Object.keys(freq).length;
        var data = [];
        for (var word in freq) {
            data.push({ word: word, count: freq[word], density: freq[word] / total * 100 });
        }
        data.sort(function(a, b) { return b.count - a.count; });
        lastData = data;

        if (statsEl) {
            statsEl.innerHTML =
                '<span class="kdc-stat-item">Words: <span class="kdc-stat-value">' + total + '</span></span>' +
                '<span class="kdc-stat-item">Unique (excl. stop words): <span class="kdc-stat-value">' + unique + '</span></span>';
        }

        renderTable(data);
    }

    function renderTable(data) {
        if (!tableWrapEl) return;
        var sorted = data.slice();
        sorted.sort(function(a, b) {
            var va = a[sortCol === 0 ? 'word' : sortCol === 1 ? 'count' : 'density'];
            var vb = b[sortCol === 0 ? 'word' : sortCol === 1 ? 'count' : 'density'];
            if (typeof va === 'string') {
                return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
            }
            return sortAsc ? va - vb : vb - va;
        });

        var html = '<table class="kdc-table"><thead><tr>';
        html += '<th data-col="0">Word' + (sortCol === 0 ? (sortAsc ? ' ▲' : ' ▼') : '') + '</th>';
        html += '<th data-col="1">Count' + (sortCol === 1 ? (sortAsc ? ' ▲' : ' ▼') : '') + '</th>';
        html += '<th data-col="2">Density' + (sortCol === 2 ? (sortAsc ? ' ▲' : ' ▼') : '') + '</th>';
        html += '</tr></thead><tbody>';

        var max = sorted.length > 0 ? sorted[0].count : 1;
        if (sortCol === 1 && !sortAsc) max = sorted[0].count;

        for (var i = 0; i < sorted.length && i < 200; i++) {
            var item = sorted[i];
            var barWidth = Math.round(item.count / (data[0].count || 1) * 100);
            html += '<tr><td>' + item.word + '</td><td>' + item.count + '</td><td>';
            html += '<div class="kdc-density-bar-wrap">';
            html += '<div class="kdc-density-bar" style="width:' + barWidth + 'px;max-width:80px"></div>';
            html += '<span class="kdc-density-pct">' + item.density.toFixed(2) + '%</span>';
            html += '</div></td></tr>';
        }
        html += '</tbody></table>';
        tableWrapEl.innerHTML = html;

        var ths = tableWrapEl.querySelectorAll('th[data-col]');
        for (var j = 0; j < ths.length; j++) {
            ths[j].addEventListener('click', function() {
                var col = parseInt(this.getAttribute('data-col'));
                if (sortCol === col) { sortAsc = !sortAsc; } else { sortCol = col; sortAsc = col === 0; }
                if (lastData) renderTable(lastData);
            });
        }
    }

    if (analyzeBtn) analyzeBtn.addEventListener('click', analyze);

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (inputEl) inputEl.value = '';
            if (statsEl) statsEl.innerHTML = '';
            if (tableWrapEl) tableWrapEl.innerHTML = '';
            lastData = null;
        });
    }
})();
