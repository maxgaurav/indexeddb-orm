self.importScripts('WorkerHelper.js');

const helper = new WorkerHelper(self);

helper.on('check', () => {
    console.log('chekcing in webworker');
    helper.emit('check', true);
});