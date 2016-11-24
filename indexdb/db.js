/**
 * version 0
 * create by freeol.cn
 * create date 2016-11-14
 * **/
var IndexedDBCtrl={
	dbName:null,
	stores:null,
	init:function(dbName, stores){
		IndexedDBCtrl.dbName = dbName;
		IndexedDBCtrl.stores = stores;
		var request=IndexedDBCtrl.getIndexedDB().open(IndexedDBCtrl.dbName);
		request.onupgradeneeded = function(e) {
        	var db = e.target.result;
        	for(var i in IndexedDBCtrl.stores){
        		if(!db.objectStoreNames.contains(IndexedDBCtrl.stores[i].name)){
					var store= db.createObjectStore(IndexedDBCtrl.stores[i].name, {keyPath:IndexedDBCtrl.stores[i].key});
					for(var j in IndexedDBCtrl.stores[i].indexs){
						var index = IndexedDBCtrl.stores[i].indexs[j];
						store.createIndex(index.indexName, index.feild, {unique:index.unique}); 
					}
				}
        	}
        }
		request.onerror = function(e) {
        	IndexedDBCtrl.delDB(dbName);
        	IndexedDBCtrl.init(dbName, stores);
        }
	},
	getIndexedDB:function(){
		if ('webkitIndexedDB' in window) {
		    window.IDBTransaction = window.webkitIDBTransaction;
		    window.IDBKeyRange = window.webkitIDBKeyRange;
		}
		if (!window.indexedDB) {  
		    window.indexedDB = window.mozIndexedDB || window.webkitIndexedDB;  
		} 
		return window.indexedDB;
	},
	open:function(storeName,handle, errHandle){
		var request=IndexedDBCtrl.getIndexedDB().open(IndexedDBCtrl.dbName);
		request.onerror=function(e){
            errHandle(e);
        }
        request.onsuccess=function(e){
        	var db = e.target.result;
        	var transaction=db.transaction(storeName,'readwrite'); 
        	var store = transaction.objectStore(storeName); 
            handle(db, store);
            IndexedDBCtrl.close(db);
        }
   },
	close:function(db){
		db.close();
	},
	delDB:function(dbName){
		IndexedDBCtrl.getIndexedDB().deleteDatabase(dbName)
	},
	getByKey:function(store, key, handle){
		var request = store.get(key);
		request.onsuccess = function (e){
			var  result = e.target.result;
			handle(result);
		};
	},
	getAllData:function(store, handle){
		var request=store.openCursor();
		request.onsuccess=function(e){
			var cursor=e.target.result;
			handle(cursor);
		};
	},
	getByIndex:function(store, indexName, val, handle){
		var index = store.index(indexName);
		var request=index.openCursor(IDBKeyRange.only(val))
        request.onsuccess=function(e){
            var cursor=e.target.result;
            handle(cursor);
        }
	},
	getDataByIndexRange:function(store, indexName, min, eqmin, max, eqmax, handle){
		var index = store.index(indexName);
		var request=index.openCursor(IDBKeyRange.bound(min, max, eqmin, eqmax))
        request.onsuccess=function(e){
            var cursor=e.target.result;
            handle(cursor);
        }
	},
	getMinByIndexRange:function(store, indexName, min, eqmin, handle){
		var index = store.index(indexName);
		var request=index.openCursor(IDBKeyRange.lowerBound(min, eqmin));
        request.onsuccess=function(e){
            var cursor=e.target.result;
            handle(cursor);
        }
	},
	getMaxByIndexRange:function(store, indexName, max, eqmax, handle){
		var index = store.index(indexName);
		var request=index.openCursor(IDBKeyRange.upperBound(max, eqmax));
        request.onsuccess=function(e){
            var cursor=e.target.result;
            handle(cursor);
        }
	}
};

/* example
IndexedDBCtrl.delDB('test');
		
var stores = [
	{name:'testStore', key:'id'},
	{name:'user', key:'code'},
	{name:'common', key:'code'}
];
IndexedDBCtrl.init('test', stores);

IndexedDBCtrl.open('testStore', function(db, store){
	var testStoreName = 'testStore';
    var timestamp = Date.parse(new Date());
    var testData = [
		{'id':0, 'code':'a'+timestamp},
		{'id':1, 'code':'b'+timestamp},
		{'id':2, 'code':'c'+timestamp},
		{'id':3, 'code':'d'+timestamp}
	];
	for(var i in testData){
		store.put(testData[i]);
	}
	IndexedDBCtrl.getByKey(store, 0, function(rs){
		console.log('getById', rs);
	});
	store.put({'id':1, 'code':'abc'});
	store.delete(2);
	IndexedDBCtrl.close(db);
});
IndexedDBCtrl.open('user', function(db, store){
	var testStoreName = 'testStore';
    var timestamp = Date.parse(new Date());
    var testData = [
		{'code':'000000', 'name':'admin'}
	];
	for(var i in testData){
		store.put(testData[i]);
	}
	IndexedDBCtrl.getByKey(store, '000000', function(rs){
		console.log('getById', rs);
	});
	IndexedDBCtrl.close(db);
});
 * */
