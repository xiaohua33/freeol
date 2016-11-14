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
        	console.log(IndexedDBCtrl.stores)
        	for(var i in IndexedDBCtrl.stores){
        		if(!db.objectStoreNames.contains(IndexedDBCtrl.stores[i].name)){
					db.createObjectStore(IndexedDBCtrl.stores[i].name, {keyPath:IndexedDBCtrl.stores[i].key});
				}
        	}
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
	open:function(storeName,handle){
		var request=IndexedDBCtrl.getIndexedDB().open(IndexedDBCtrl.dbName);
		request.onerror=function(e){
            console.log('OPen Error!', e);
        }
        request.onsuccess=function(e){
        	var db = e.target.result;
        	var transaction=db.transaction(storeName,'readwrite'); 
        	var store = transaction.objectStore(storeName); 
            handle(db, store);
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
