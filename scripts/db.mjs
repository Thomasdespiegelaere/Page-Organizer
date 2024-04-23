export const Db = (() => {
    let instance;
    function createInstance() {
        return {
            constructor: function () {
                this.db; // = instance.db;
                this.dbVersion; // = instance.dbVersion;
                this.dbReady; // = instance.dbReady;                
            },
            InitDb: function () {
                let request = indexedDB.open('Cursusen', this.dbVersion);

                request.onerror = function (e) {
                    console.error('Unable to open database.');
                }

                request.onsuccess = function (e) {
                    this.db = e.target.result;
                    this.dbReady = true;
                    console.log('db opened');
                }.bind(this);

                request.onupgradeneeded = function (e) {
                    this.db = e.target.result;
                    var objectStore = this.db.createObjectStore('Images', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex("courseNames", "courseName", { unique: false });
                    objectStore.createIndex("pages", "page", { unique: false });
                    objectStore.createIndex("types", "type", { unique: false });
                    objectStore.createIndex("taglist", "tags", { unique: false });
                    this.dbReady = true;
                }
            },
            setImage: function (ob) {
                console.log('store image');

                let transaction = this.db.transaction(['Images'], 'readwrite');
                let addRequest = transaction.objectStore('Images').add(ob);

                addRequest.onerror = function (e) {
                    console.log('error storing data');
                    console.error(e);
                }

                transaction.oncomplete = function (e) {
                    console.log('data stored');
                }
            },
            getImage: function (recordToLoad) {
                console.log(this.db);
                return new Promise((resolve, reject) => {
                    if (recordToLoad === '') recordToLoad = 1;

                    let trans = this.db.transaction(['Images'], 'readonly');

                    let req = trans.objectStore('Images').get(recordToLoad);
                    req.onsuccess = function (e) {
                        let record = e.target.result;
                        return resolve(record);
                    };

                    req.onerror = function (e) {
                        console.log('error getting record');
                        console.error(e);
                        return reject(e);
                    };
                });
            }
        };
    }
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            instance.InitDb();
            return instance;
        },
    };
})();