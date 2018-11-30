// Remove array from array
self.addEventListener('message', e => {
    let model = e.data[0];
    let itemsToRemove = e.data[1];
    let res = model.filter(item => !itemsToRemove.includes(item.id));
    self.postMessage(res);
}, false);