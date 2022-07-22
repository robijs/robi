// @START-File
const store = {
    elementIdCounter: 0,
    rowIdCounter: 0,
    cellIdCounter: 0,
    viewScrollTop: 0,
    data: {},
    abortControllers: [],
    workers: [],
    components: {},
    rows: {},
    modals: [],
    models: {},
    lists: {},
    user: {},
    routes: []
};

// TODO: add Store.modals and getter/setter methods
const Store = {
    add(param) {
        const {
            type,
        } = param;

        switch (type) {
            case 'list':
                {
                    const {
                        list,
                        items
                    } = param;
        
                    store.lists[list] = items;
                    break;
                }
            case 'model':
                {
                    const {
                        name,
                        model
                    } = param;
        
                    store.models[name] = model;
                    break;
                }
            default:
                {
                    const {
                        name
                    } = param;
        
                    store.components[name] = param;
                    break;
                }
        }
    },
    addWorker(worker) {
        store.workers.push(worker);
    },
    terminateWorkers() {
        store.workers.forEach(worker => {
            worker.terminate();
        });
    },
    addAbortController(controller) {
        store.abortControllers.push(controller);
    },
    getAbortControllers() {
        return store.abortControllers;
    },
    abortAll() {
        store.abortControllers.forEach(controller => {
            controller.abort();
        });
    },
    get(name) {
        if (store.components[name]) {
            return store.components[name].component;
        } else if (store.lists[name]) {
            return store.lists[name];
        } else if(store.models[name]) {
            return store.models[name];
        } else {
            return undefined;
        }
    },
    getCell({ rowId, id }) {
        return store.rows[rowId][id];
    },
    getModals() {
        return store.modals;
    },
    getNextId() {
        return `component-${store.elementIdCounter++}`; 
    },
    getNextRow() {
        return `row-${store.rowIdCounter++}`;
    },
    getNextCell() {
        return `cell-${store.cellIdCounter++}`;
    },
    getRow(id) {
        return store.rows[id];
    },
    getRows() {
        return Object.values(store.rows);
    },
    remove(name) {
        store.components[name].component.remove();
        
        delete store.components[name];
    },
    empty() {
        store.components = {};
        store.rows = {};
        store.modals = [];
        // TODO: Do we want to persist data when routing?
        // store.data = [];
    },
    user(userInfo) {
        if (typeof userInfo === 'object') {
            store.user = userInfo;
        } else {
            return store.user;
        }
    },
    viewScrollTop(param) {
        if (param == 0) {
            store.viewScrollTop = 0;
        } else if (param) {
            if (typeof param === 'number') {
                store.viewScrollTop = param;
            } else {
                console.log(`${param} is not a number`);
            }
        } else {
            return store.viewScrollTop;
        }
    },
    removeData(name) {
        delete store.data[name];
    },
    setData(name, data) {
        store.data[name] = data;
    },
    getData(name) {
        return store.data[name];
    },
    setRoutes(routes) {
        store.routes = routes;
    },
    routes() {
        return store.routes;
    },
    addRow(component) {
        store.rows[component.id()] = component;
    },
    addCell({ rowId, id, component }) {
        store.rows[rowId][id] = component;
    },
    addModal(component) {
        store.modals.push(component);
    },
    removeCell({ rowId, id }) {
        delete store.rows[rowId][id];
    },
    // TODO: Remove modal by passing in compononet instead of id string
    removeModal(param) {
        if (typeof param === 'string') {
            const modal = store.modals.find(modal => modal.id() === param);
            const index = store.modals.indexOf(modal);

            store.modals.splice(index, 1);

            return;
        }
    },
    removeRow({ id }) {
        delete store.rows[id];
    },
    resetRows() {
        store.rows = {};
    }
}

Object.freeze(Store);

export { Store }
// @END-File
