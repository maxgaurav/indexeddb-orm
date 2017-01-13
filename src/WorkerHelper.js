class WorkerHelper {

    constructor(worker) {
        this.worker = worker;
        this.eventNameSpace = "worker:";

        this.createOnMessage();
    }

    emit(messageName, data) {
        debugger;
        const eventData = {
            name: messageName,
            data: data
        };
        this.worker.postMessage(eventData);
    }

    createOnMessage() {
        const helper = this;
        this.worker.onmessage = function(event) {

            const eventData = {
                detail : event.data.data
            };
            const customEvent = new CustomEvent(helper.eventNameSpace + event.data.name, eventData);

            helper.worker.dispatchEvent(customEvent);
        }
    }

    on(messageName, rFunc){
        this.worker.addEventListener(this.eventNameSpace + messageName, rFunc);
    }
}