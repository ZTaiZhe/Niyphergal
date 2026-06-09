const TELEMETRY_VERSION = '1.0.0';
const BATCH_UPLOAD_INTERVAL = 5000;
const MAX_BATCH_SIZE = 20;

const MetricType = {
    BUSINESS: 'business',
    PERFORMANCE: 'performance',
    STABILITY: 'stability'
};

const BusinessEvents = {
    FILTER_APPLIED: 'Filter_Applied',
    SEARCH_TRIGGERED: 'Search_Triggered',
    ORDER_TOGGLED: 'Order_Toggled'
};

const PerformanceMetrics = {
    TIME_TO_NEW_RESULTS: 'Time_to_New_Results',
    SEARCH_DURATION: 'Search_Duration',
    RENDER_DURATION: 'Render_Duration'
};

const StabilityMetrics = {
    FETCH_ABORT_COUNT: 'Fetch_Abort_Count',
    FALLBACK_ERROR_COUNT: 'Fallback_Error_Count',
    CACHE_HIT_COUNT: 'Cache_Hit_Count',
    CACHE_MISS_COUNT: 'Cache_Miss_Count'
};

class TelemetryStore {
    constructor() {
        this._metrics = {
            [StabilityMetrics.FETCH_ABORT_COUNT]: 0,
            [StabilityMetrics.FALLBACK_ERROR_COUNT]: 0,
            [StabilityMetrics.CACHE_HIT_COUNT]: 0,
            [StabilityMetrics.CACHE_MISS_COUNT]: 0
        };
        this._eventQueue = [];
        this._sessionStartTime = Date.now();
        this._searchCount = 0;
    }

    incrementMetric(metricName, value = 1) {
        if (this._metrics.hasOwnProperty(metricName)) {
            this._metrics[metricName] += value;
        }
    }

    setMetric(metricName, value) {
        this._metrics[metricName] = value;
    }

    getMetric(metricName) {
        return this._metrics[metricName] || 0;
    }

    getAllMetrics() {
        return { ...this._metrics };
    }

    pushEvent(event) {
        this._eventQueue.push({
            ...event,
            timestamp: Date.now(),
            sessionId: this._getSessionId()
        });
    }

    getEventQueue() {
        return [...this._eventQueue];
    }

    clearEventQueue() {
        this._eventQueue = [];
    }

    incrementSearchCount() {
        this._searchCount++;
    }

    getSearchCount() {
        return this._searchCount;
    }

    getSessionDuration() {
        return Date.now() - this._sessionStartTime;
    }

    _getSessionId() {
        if (!this._sessionId) {
            this._sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }
        return this._sessionId;
    }

    reset() {
        this._metrics = {
            [StabilityMetrics.FETCH_ABORT_COUNT]: 0,
            [StabilityMetrics.FALLBACK_ERROR_COUNT]: 0,
            [StabilityMetrics.CACHE_HIT_COUNT]: 0,
            [StabilityMetrics.CACHE_MISS_COUNT]: 0
        };
        this._eventQueue = [];
        this._searchCount = 0;
        this._sessionStartTime = Date.now();
    }
}

class PerformanceTracker {
    constructor() {
        this._marks = new Map();
        this._measures = new Map();
        this._supported = this._checkPerformanceSupport();
    }

    _checkPerformanceSupport() {
        return !!(window.performance &&
                  window.performance.mark &&
                  window.performance.measure &&
                  window.performance.getEntriesByName);
    }

    mark(name) {
        if (!this._supported) {
            this._marks.set(name, Date.now());
            return;
        }

        try {
            performance.mark(name);
        } catch (e) {
            this._marks.set(name, Date.now());
        }
    }

    measure(name, startMark, endMark) {
        if (!this._supported) {
            const startTime = this._marks.get(startMark);
            const endTime = this._marks.get(endMark) || Date.now();
            if (startTime) {
                this._measures.set(name, endTime - startTime);
            }
            return this._measures.get(name);
        }

        try {
            if (endMark) {
                performance.measure(name, startMark, endMark);
            } else {
                performance.measure(name, startMark);
            }

            const entries = performance.getEntriesByName(name, 'measure');
            if (entries.length > 0) {
                const duration = entries[entries.length - 1].duration;
                this._measures.set(name, duration);
                return duration;
            }
        } catch (e) {
            const startTime = this._marks.get(startMark);
            const endTime = this._marks.get(endMark) || Date.now();
            if (startTime) {
                const duration = endTime - startTime;
                this._measures.set(name, duration);
                return duration;
            }
        }
        return null;
    }

    getMeasure(name) {
        if (this._measures.has(name)) {
            return this._measures.get(name);
        }

        if (this._supported) {
            try {
                const entries = performance.getEntriesByName(name, 'measure');
                if (entries.length > 0) {
                    return entries[entries.length - 1].duration;
                }
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    clearMarks(...names) {
        names.forEach(name => {
            this._marks.delete(name);
            if (this._supported) {
                try {
                    performance.clearMarks(name);
                } catch (e) {}
            }
        });
    }

    clearMeasures(...names) {
        names.forEach(name => {
            this._measures.delete(name);
            if (this._supported) {
                try {
                    performance.clearMeasures(name);
                } catch (e) {}
            }
        });
    }

    clearAll() {
        this._marks.clear();
        this._measures.clear();
        if (this._supported) {
            try {
                performance.clearMarks();
                performance.clearMeasures();
            } catch (e) {}
        }
    }

    getNavigationTiming() {
        if (!this._supported || !performance.timing) {
            return null;
        }

        const timing = performance.timing;
        return {
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,
            domProcessing: timing.domComplete - timing.domInteractive,
            totalLoad: timing.loadEventEnd - timing.navigationStart
        };
    }
}

class TelemetryReporter {
    constructor(store) {
        this._store = store;
        this._batchTimer = null;
        this._endpoint = null;
        this._enabled = true;
        this._debug = false;
    }

    setEndpoint(endpoint) {
        this._endpoint = endpoint;
    }

    setEnabled(enabled) {
        this._enabled = enabled;
        if (!enabled && this._batchTimer) {
            this._flushBatch();
        }
    }

    setDebug(debug) {
        this._debug = debug;
    }

    report(event) {
        if (!this._enabled) {return;}

        this._store.pushEvent(event);

        if (this._debug) {
            console.log('[Telemetry] Event:', event);
        }

        if (this._store.getEventQueue().length >= MAX_BATCH_SIZE) {
            this._flushBatch();
        }
    }

    startBatchUpload() {
        if (this._batchTimer) {return;}

        this._batchTimer = setInterval(() => {
            this._flushBatch();
        }, BATCH_UPLOAD_INTERVAL);
    }

    stopBatchUpload() {
        if (this._batchTimer) {
            clearInterval(this._batchTimer);
            this._batchTimer = null;
        }
    }

    async _flushBatch() {
        const events = this._store.getEventQueue();
        if (events.length === 0) {return;}

        this._store.clearEventQueue();

        if (this._endpoint) {
            try {
                await this._sendToEndpoint(events);
            } catch (e) {
                if (this._debug) {
                    console.error('[Telemetry] Failed to send batch:', e);
                }
            }
        } else if (this._debug) {
            console.log('[Telemetry] Batch (no endpoint):', events);
        }
    }

    async _sendToEndpoint(events) {
        if (!this._endpoint) {return;}

        const payload = {
            version: TELEMETRY_VERSION,
            events,
            metrics: this._store.getAllMetrics(),
            sessionDuration: this._store.getSessionDuration()
        };

        const response = await fetch(this._endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            keepalive: true
        });

        if (!response.ok) {
            throw new Error(`Telemetry upload failed: ${response.status}`);
        }
    }

    async reportImmediate(event) {
        if (!this._enabled) {return;}

        const payload = {
            version: TELEMETRY_VERSION,
            events: [{
                ...event,
                timestamp: Date.now(),
                sessionId: this._store._getSessionId()
            }],
            metrics: this._store.getAllMetrics(),
            sessionDuration: this._store.getSessionDuration()
        };

        if (this._endpoint) {
            try {
                await this._sendToEndpoint([payload.events[0]]);
            } catch (e) {
                if (this._debug) {
                    console.error('[Telemetry] Failed to send immediate:', e);
                }
            }
        } else if (this._debug) {
            console.log('[Telemetry] Immediate:', payload);
        }
    }
}

class Telemetry {
    constructor() {
        this._store = new TelemetryStore();
        this._performance = new PerformanceTracker();
        this._reporter = new TelemetryReporter(this._store);
        this._initialized = false;
        this._currentSearchId = 0;
    }

    init(options = {}) {
        if (this._initialized) {return;}

        const {
            endpoint = null,
            enabled = true,
            debug = false,
            autoBatch = true
        } = options;

        this._reporter.setEnabled(enabled);
        this._reporter.setDebug(debug);

        if (endpoint) {
            this._reporter.setEndpoint(endpoint);
        }

        if (autoBatch) {
            this._reporter.startBatchUpload();
        }

        window.addEventListener('beforeunload', () => {
            this._reporter.stopBatchUpload();
            this._reporter._flushBatch();
        });

        this._initialized = true;
    }

    trackFilterApplied(params) {
        const event = {
            type: MetricType.BUSINESS,
            name: BusinessEvents.FILTER_APPLIED,
            data: {
                sort: params.sort || '',
                filter: params.filter || '',
                order: params.order || 'desc',
                keyword: params.q || params.keyword || ''
            }
        };

        this._reporter.report(event);
    }

    trackSearchTriggered(params) {
        this._store.incrementSearchCount();

        const event = {
            type: MetricType.BUSINESS,
            name: BusinessEvents.SEARCH_TRIGGERED,
            data: {
                keyword: params.q || params.keyword || '',
                hasSort: !!(params.sort),
                hasFilter: !!(params.filter),
                order: params.order || 'desc'
            }
        };

        this._reporter.report(event);
    }

    trackOrderToggled(order, params) {
        const event = {
            type: MetricType.BUSINESS,
            name: BusinessEvents.ORDER_TOGGLED,
            data: {
                order,
                keyword: params.q || params.keyword || '',
                sort: params.sort || ''
            }
        };

        this._reporter.report(event);
    }

    startPerformanceMeasure(searchId) {
        const id = searchId || ++this._currentSearchId;
        const startMark = `search-start-${id}`;

        this._performance.mark(startMark);

        return {
            id,
            end: () => this.endPerformanceMeasure(id)
        };
    }

    endPerformanceMeasure(searchId) {
        const id = searchId || this._currentSearchId;
        const startMark = `search-start-${id}`;
        const endMark = `search-end-${id}`;
        const measureName = PerformanceMetrics.TIME_TO_NEW_RESULTS;

        this._performance.mark(endMark);
        const duration = this._performance.measure(measureName, startMark, endMark);

        if (duration !== null) {
            const event = {
                type: MetricType.PERFORMANCE,
                name: PerformanceMetrics.TIME_TO_NEW_RESULTS,
                data: {
                    duration: Math.round(duration),
                    unit: 'ms'
                }
            };

            this._reporter.report(event);
        }

        this._performance.clearMarks(startMark, endMark);
        this._performance.clearMeasures(measureName);

        return duration;
    }

    trackSearchStart(searchId) {
        const id = searchId || ++this._currentSearchId;
        this._performance.mark(`click-start-${id}`);
        return id;
    }

    trackSearchComplete(searchId) {
        const id = searchId || this._currentSearchId;
        const startMark = `click-start-${id}`;
        const endMark = `entering-end-${id}`;
        const measureName = PerformanceMetrics.TIME_TO_NEW_RESULTS;

        this._performance.mark(endMark);
        const duration = this._performance.measure(measureName, startMark, endMark);

        if (duration !== null) {
            const event = {
                type: MetricType.PERFORMANCE,
                name: PerformanceMetrics.TIME_TO_NEW_RESULTS,
                data: {
                    duration: Math.round(duration),
                    unit: 'ms',
                    searchId: id
                }
            };

            this._reporter.report(event);
        }

        this._performance.clearMarks(startMark, endMark);
        this._performance.clearMeasures(measureName);

        return duration;
    }

    trackEnteringEnd(searchId) {
        const id = searchId || this._currentSearchId;
        this._performance.mark(`entering-end-${id}`);
    }

    recordAbort() {
        this._store.incrementMetric(StabilityMetrics.FETCH_ABORT_COUNT);
    }

    recordFallbackError() {
        this._store.incrementMetric(StabilityMetrics.FALLBACK_ERROR_COUNT);
    }

    recordCacheHit() {
        this._store.incrementMetric(StabilityMetrics.CACHE_HIT_COUNT);
    }

    recordCacheMiss() {
        this._store.incrementMetric(StabilityMetrics.CACHE_MISS_COUNT);
    }

    getStats() {
        const metrics = this._store.getAllMetrics();
        const totalCacheRequests = metrics[StabilityMetrics.CACHE_HIT_COUNT] +
                                   metrics[StabilityMetrics.CACHE_MISS_COUNT];

        return {
            stability: {
                fetchAbortCount: metrics[StabilityMetrics.FETCH_ABORT_COUNT],
                fallbackErrorCount: metrics[StabilityMetrics.FALLBACK_ERROR_COUNT],
                cacheHitCount: metrics[StabilityMetrics.CACHE_HIT_COUNT],
                cacheMissCount: metrics[StabilityMetrics.CACHE_MISS_COUNT],
                cacheHitRate: totalCacheRequests > 0
                    ? (metrics[StabilityMetrics.CACHE_HIT_COUNT] / totalCacheRequests * 100).toFixed(2) + '%'
                    : '0%',
                abortRate: this._store.getSearchCount() > 0
                    ? (metrics[StabilityMetrics.FETCH_ABORT_COUNT] / this._store.getSearchCount() * 100).toFixed(2) + '%'
                    : '0%'
            },
            session: {
                searchCount: this._store.getSearchCount(),
                duration: this._store.getSessionDuration()
            }
        };
    }

    getPerformanceMeasures() {
        return {
            timeToNewResults: this._performance.getMeasure(PerformanceMetrics.TIME_TO_NEW_RESULTS),
            navigationTiming: this._performance.getNavigationTiming()
        };
    }

    setEnabled(enabled) {
        this._reporter.setEnabled(enabled);
    }

    setDebug(debug) {
        this._reporter.setDebug(debug);
    }

    setEndpoint(endpoint) {
        this._reporter.setEndpoint(endpoint);
    }

    flush() {
        return this._reporter._flushBatch();
    }

    reset() {
        this._store.reset();
        this._performance.clearAll();
    }

    destroy() {
        this._reporter.stopBatchUpload();
        this._reporter._flushBatch();
        this._performance.clearAll();
    }
}

const telemetry = new Telemetry();

export {
    telemetry,
    Telemetry,
    MetricType,
    BusinessEvents,
    PerformanceMetrics,
    StabilityMetrics
};

export default telemetry;
