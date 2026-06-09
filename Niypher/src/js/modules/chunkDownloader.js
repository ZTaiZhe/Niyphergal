const DEFAULT_CONCURRENCY = 3;
const DEFAULT_RETRIES = 3;
const MIN_CHUNK_SIZE = 512 * 1024;
const MAX_CHUNK_SIZE = 4 * 1024 * 1024;

async function headRequest(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) return null;

        const contentLength = response.headers.get('content-length');
        const acceptRanges = response.headers.get('accept-ranges');

        if (!contentLength) return null;

        return {
            contentLength: parseInt(contentLength, 10),
            acceptRanges: acceptRanges === 'bytes'
        };
    } catch {
        return null;
    }
}

function estimateChunkSize(contentLength) {
    let bandwidth = 10 * 1024 * 1024;
    let latency = 50;

    if (navigator.connection) {
        if (navigator.connection.downlink) {
            bandwidth = navigator.connection.downlink * 1024 * 1024;
        }
        if (navigator.connection.rtt) {
            latency = navigator.connection.rtt;
        }
    }

    const optimalChunk = bandwidth * (latency / 1000) / 8;
    return Math.max(MIN_CHUNK_SIZE, Math.min(MAX_CHUNK_SIZE, Math.floor(optimalChunk)));
}

async function fetchChunk(url, start, end, retries = DEFAULT_RETRIES) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Range': `bytes=${start}-${end}`
                }
            });

            if (!response.ok && response.status !== 206) {
                throw new Error(`HTTP ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            return { start, end, buffer, size: buffer.byteLength };
        } catch (e) {
            lastError = e;
            if (attempt < retries) {
                await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 100));
            }
        }
    }

    throw lastError;
}

class ChunkDownloader {
    constructor() {
        this._activeDownloads = new Map();
        this._aborted = new Set();
    }

    async download(url, options = {}) {
        const {
            concurrency = DEFAULT_CONCURRENCY,
            onProgress = null,
            signal = null
        } = options;

        const downloadId = `${url}-${Date.now()}`;

        try {
            const headInfo = await this._checkSupport(url, signal);

            if (!headInfo || !headInfo.acceptRanges) {
                return await this._fallbackDownload(url, { onProgress, signal });
            }

            const { contentLength } = headInfo;
            const chunkSize = estimateChunkSize(contentLength);
            const totalChunks = Math.ceil(contentLength / chunkSize);
            const chunks = [];

            if (signal) {
                signal.addEventListener('abort', () => {
                    this._aborted.add(downloadId);
                });
            }

            for (let i = 0; i < totalChunks; i += concurrency) {
                if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

                const batch = [];
                for (let j = 0; j < concurrency && (i + j) < totalChunks; j++) {
                    const chunkIndex = i + j;
                    const start = chunkIndex * chunkSize;
                    const end = Math.min(start + chunkSize - 1, contentLength - 1);
                    batch.push(fetchChunk(url, start, end));
                }

                const results = await Promise.all(batch);
                results.forEach(r => chunks.push(r));

                if (onProgress) {
                    const downloaded = chunks.reduce((sum, c) => sum + c.size, 0);
                    onProgress({ downloaded, total: contentLength, percent: (downloaded / contentLength) * 100 });
                }
            }

            chunks.sort((a, b) => a.start - b.start);
            const merged = new Uint8Array(contentLength);
            let offset = 0;
            for (const chunk of chunks) {
                merged.set(new Uint8Array(chunk.buffer), offset);
                offset += chunk.size;
            }

            return merged.buffer;

        } catch (e) {
            if (e.name === 'AbortError') throw e;
            return await this._fallbackDownload(url, { onProgress, signal });
        }
    }

    async _checkSupport(url, signal) {
        const cached = this._activeDownloads.get(`head:${url}`);
        if (cached) return cached;

        const info = await headRequest(url);
        if (info) {
            this._activeDownloads.set(`head:${url}`, info);
        }
        return info;
    }

    async _fallbackDownload(url, { onProgress, signal }) {
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const contentLength = parseInt(response.headers.get('content-length') || '0', 10);
        const reader = response.body?.getReader();

        if (reader && contentLength) {
            const chunks = [];
            let downloaded = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                downloaded += value.length;

                if (onProgress) {
                    onProgress({ downloaded, total: contentLength, percent: (downloaded / contentLength) * 100 });
                }
            }

            const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
            const merged = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                merged.set(chunk, offset);
                offset += chunk.length;
            }
            return merged.buffer;
        }

        return await response.arrayBuffer();
    }

    abort(downloadId) {
        this._aborted.add(downloadId);
    }

    clearCache() {
        this._activeDownloads.clear();
    }
}

const chunkDownloader = new ChunkDownloader();

export { chunkDownloader, ChunkDownloader, downloadInChunks };
export default chunkDownloader;

export async function downloadInChunks(url, options = {}) {
    return chunkDownloader.download(url, options);
}
