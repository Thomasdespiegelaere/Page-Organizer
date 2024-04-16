let db;
let dbVersion = 1;
let dbReady = false;

export class Db {
    InitDb() {
        let request = indexedDB.open('Cursusen', dbVersion);

        request.onerror = function (e) {
            console.error('Unable to open database.');
        }

        request.onsuccess = function (e) {
            db = e.target.result;
            console.log('db opened');
        }

        request.onupgradeneeded = function (e) {
            let db = e.target.result;
            var objectStore = db.createObjectStore('Images', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex("courseNames", "courseName", { unique: false });
            objectStore.createIndex("pages", "page", { unique: false });
            objectStore.createIndex("types", "type", { unique: false });
            dbReady = true;
        }
    }

    setImage(ob) {
        console.log('store image');

        let transaction = db.transaction(['Images'], 'readwrite');
        let addRequest = transaction.objectStore('Images').add(ob);

        addRequest.onerror = function (e) {
            console.log('error storing data');
            console.error(e);
        }

        transaction.oncomplete = function (e) {
            console.log('data stored');
        }
    }

    async getImage(recordToLoad) {
        return new Promise((resolve, reject) => {
            if (recordToLoad === '') recordToLoad = 1;

            let trans = db.transaction(['Images'], 'readonly');

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

}