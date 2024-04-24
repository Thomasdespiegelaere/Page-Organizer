export const Db = (() => {
    let instance;
    function createInstance() {
        return {
            constructor: function () {
                this.db;
                this.dbVersion; 
                this.dbReady;                 
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
                    this.db.createObjectStore('Courses', { keyPath: 'id', autoIncrement: true });
                    this.db.createObjectStore('tempImages', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex("courseNames", "courseName", { unique: false });
                    objectStore.createIndex("pages", "page", { unique: false });
                    objectStore.createIndex("types", "type", { unique: false });
                    objectStore.createIndex("taglist", "tags", { unique: false });
                    this.dbReady = true;
                }
            },
            setImage: function (table, ob) {
                console.log('store image');

                let transaction = this.db.transaction([table], 'readwrite');
                let addRequest = transaction.objectStore(table).add(ob);

                addRequest.onerror = function (e) {
                    console.log('error storing data');
                    console.error(e);
                }

                transaction.oncomplete = function (e) {
                    console.log('data stored');
                }
            },
            getImage: function (table, recordToLoad) {
                console.log(this.db);
                return new Promise((resolve, reject) => {
                    if (recordToLoad === '') recordToLoad = 1;

                    let trans = this.db.transaction([table], 'readonly');

                    let req = trans.objectStore(table).get(recordToLoad);
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
            },
            getAllImages: function () {
                var images = [];
                return new Promise((resolve, reject) => {
                    var imagesObjectStore = this.db.transaction(['Images'], 'readonly').objectStore('Images');
                    var request = imagesObjectStore.openCursor();
                    request.onsuccess = function (event) {
                        var cursor = event.target.result;

                        if (cursor) {
                            images.push(cursor.value);
                            cursor.continue();
                        }
                        else
                            return resolve(images);
                    }

                    request.onerror = function (e) {
                        console.log('error getting record');
                        console.error(e);
                        return reject(e);
                    }
                });
            },
            getAllCourses: function () {
                var courses = [];
                return new Promise((resolve, reject) => {
                    var coursesObjectStore = this.db.transaction(['Courses'], 'readonly').objectStore('Courses');
                    var request = coursesObjectStore.openCursor();
                    request.onsuccess = function (event) {
                        var cursor = event.target.result;

                        if (cursor) {
                            courses.push(cursor.value);
                            cursor.continue();
                        }
                        else
                            return resolve(courses);
                    }

                    request.onerror = function (e) {
                        console.log('error getting record');
                        console.error(e);
                        return reject(e);
                    }
                });
            },
            getLastImage: function (table) {
                console.log(this.db);
                return new Promise((resolve, reject) => {
                    let trans = this.db.transaction([table], 'readonly');

                    let req = trans.objectStore(table).count();
                    req.onsuccess = function (e) {
                        let count = e.target.result;
                        let request = trans.objectStore(table).get(count);
                        request.onsuccess = function (e) {
                            let record = e.target.result;
                            return resolve(record);
                        };

                        request.onerror = function (e) {
                            console.log('error getting record');
                            console.error(e);
                            return reject(e);
                        };
                    };

                    req.onerror = function (e) {
                        console.log('error getting record');
                        console.error(e);
                        return reject(e);
                    };
                });
            },
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