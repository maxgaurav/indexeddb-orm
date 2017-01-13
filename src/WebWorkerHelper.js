class WebWorkerHelper {
    constructor(worker) {
        this.worker = worker;
        this.eventNameSpace = 'webworker:';

        this.createOnMessage();
    }

    createPostMessage(messageName, data) {
        const eventData = {
            name: messageName,
            data: data
        };

        this.worker.postMessage(eventData);
    }

    createOnMessage() {
        this.worker.onmessage = function (event) {
            const eventData = {
                detail: event.data.data
            };

            const customEvent = new CustomEvent(this.eventNameSpace + event.data.name, eventData);
            window.dispatchEvent(customEvent);
        }
    }

    checkIndexedDB() {
        this.createPostMessage('check', {});
    }
}