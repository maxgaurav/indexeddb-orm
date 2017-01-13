class WebWorkerHelper {
    constructor(worker) {
        this.worker = worker;
        this.eventNameSpace = 'webworker:';

        this.createOnMessage();
    }

    /**
     * Sends message to web worker with data
     *
     * @param messageName String
     * @param data Object
     */
    createPostMessage(messageName, data) {
        const eventData = {
            name: messageName,
            data: data
        };

        this.worker.postMessage(eventData);
    }

    /**
     * Function dispatches an custom event to be consumed when web worker send data
     */
    createOnMessage() {
        const helper = this;
        this.worker.onmessage = function (event) {
            const eventData = {
                detail: event.data.data
            };

            const customEvent = new CustomEvent(helper.eventNameSpace + event.data.name, eventData);
            window.dispatchEvent(customEvent);
        }
    }

    /**
     * Function checks that indexedDB is available in web worker
     *
     * @returns Promise
     */
    checkIndexedDB() {

        const helper = this;
        return new window.Promise((resolve) => {
            helper.createPostMessage('check', {});

            window.addEventListener(helper.eventNameSpace + 'check', (event) => {
                resolve(event.detail);
            });

        });
    }

    close() {
        this.createPostMessage('close',{});
    }
}