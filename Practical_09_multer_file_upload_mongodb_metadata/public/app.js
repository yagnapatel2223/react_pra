const form = document.querySelector('#uploadForm');
const status = document.querySelector('#status');
const list = document.querySelector('#files');
async function refresh() {
    try {
        const r = await fetch('/api/files');
        if (!r.ok)
            throw new Error('Could not load files');
        const files = await r.json();
        list.innerHTML = files.length ? files.map(f => `<div class="item"><strong>${escapeHtml(f.originalName)}</strong><div class="muted">${f.mimeType} · ${(f.size / 1024).toFixed(1)} KB · ${new Date(f.uploadedAt).toLocaleString()}</div><a href="/api/files/${f._id}/download">Download</a></div>`).join('') : 'No uploaded files yet.';
    }
    catch (e) {
        list.textContent = e.message;
    }
}
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    status.textContent = 'Uploading...';
    try {
        const r = await fetch('/api/files', { method: 'POST', body: data });
        const result = await r.json();
        if (!r.ok)
            throw new Error(result.error || 'Upload failed');
        status.textContent = `Uploaded ${result.originalName} successfully.`;
        form.reset();
        await refresh();
    }
    catch (err) {
        status.textContent = err.message;
    }
});
document.querySelector('#refresh').addEventListener('click', refresh);
refresh();
