import { Settings } from '../settings/settings';

export class IndexedDBSource {

  openRequest: IDBOpenDBRequest;
  allRecords = 0;
  loadedRecords = 0;
  loadedRecordsInPc = 0;

  constructor(public settings: Settings) {
  }

  async init(version): Promise<boolean> {
    this.openRequest = indexedDB.open('smart-table', version);
    this.openRequest.onblocked = () => {
      alert('Есть блокирующее соединение к той же базе.');
    };

    this.openRequest.onupgradeneeded = (event) => {
      const db = this.openRequest.result;
      const upgradeTransaction = (event.target as any).transaction;
      if (db.version === 2) {
        const objectStore = upgradeTransaction.objectStore(this.settings.settingsName);
        if (!objectStore.indexNames.contains('idx_arr')) {
          objectStore.createIndex('idx_arr', ['passed', 'name']);
        }
      }

      if (!db.objectStoreNames.contains(this.settings.settingsName)) {
        const objectStore = db.createObjectStore(this.settings.settingsName, { keyPath: 'system_id' });
        for (const key of Object.keys(this.settings.columns)) {
          if (this.settings.columns[key].filter !== null && key !== 'system_id') {
            objectStore.createIndex(key + '_idx', key, { multiEntry: true });
          }
        }
      }
    };
    try {
      await new Promise((resolve, reject) => {
        this.openRequest.onsuccess = resolve;
        this.openRequest.onerror = reject;
      });

      const db = this.openRequest.result;
      db.onversionchange = () => {
        db.close();
        alert('База данных устарела, пожалуйста, перезагрузите страницу.');
      };
      console.log('База подключена');
      return true;
    } catch (err) {
      console.log('Ошибка', err.message);
      return false;
    }
  }

  async addArray(data: any[], step: number): Promise<boolean> {
    this.allRecords = data.length;
    this.loadedRecords = 0;
    this.loadedRecordsInPc = 0;
    for (let i = 0; i < data.length; i += step) {
      await this.add(data.slice(i, i + step < data.length ? i + step : data.length));
    }
    console.log('Транзакция завершена');
    return true;
  }

  async add(data: any[]): Promise<boolean> {
    const db = this.openRequest.result;
    const transaction = db.transaction(this.settings.settingsName, 'readwrite');
    const objectStore = transaction.objectStore(this.settings.settingsName);

    try {
      for (const d of data) {
        const ds = this.serialize(d);
        objectStore.put(ds);
        this.loadedRecords++;
        this.loadedRecordsInPc = Math.ceil((this.loadedRecords / this.allRecords) * 100);
      }
      await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = reject;
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  serialize(value, parent?) {
    if (typeof value === 'function') {
      return value.toString();
    }
    if (typeof value === 'undefined' || value === null) {
      return value;
    }
    if (typeof value === 'object' && (parent === null || parent === undefined)) {
      const serializeObject = {};
      for (const [objectKey, objectValue] of Object.entries(value)) {
        serializeObject[objectKey] = this.serialize(objectValue, value);
        if (serializeObject[objectKey] === null || serializeObject[objectKey] === undefined) {
          delete serializeObject[objectKey];
        }
      }
      return serializeObject;
    } else {
      if (typeof value === 'object') {
        return null;
      }
    }

    return value;
  }

  async rowExist(system_id): Promise<any> {
    const db = this.openRequest.result;
    const transaction = db.transaction(this.settings.settingsName);
    const tableData = transaction.objectStore(this.settings.settingsName);
    try {
      await tableData.get(system_id);
      await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = reject;
      });
      console.log('Содержит');
      return true;
    } catch (err) {
      return false;
    }
  }

  async query(query, direction: IDBCursorDirection): Promise<any> {
    if (!query) {
      throw new TypeError('this only works if a is defined');
    }
    const results = [];
    const db = this.openRequest.result;
    const cursorRequest = db.transaction(this.settings.settingsName, 'readonly')
      .objectStore(this.settings.settingsName)
      .index('name_idx')
      .openCursor(IDBKeyRange.lowerBound('Di', true), direction);

    try {
      await this.saveCursor(cursorRequest, results);
      console.log('Успешно');
      console.log(results);
      return results;
    } catch (err) {
      console.log('Ошибка', err.message);
      return null;
    }

  }

  async saveCursor(cursorRequest: IDBRequest<IDBCursorWithValue | null>, results: any[]) {
    await new Promise((resolve, reject) => {
      cursorRequest.onsuccess = resolve;
      cursorRequest.onerror = reject;
    });
    const cursor = cursorRequest.result;
    if (cursor) {
      results.push(cursor.value);
      cursor.continue();
    } else {
      return;
    }
    await this.saveCursor(cursorRequest, results);
  }

}
