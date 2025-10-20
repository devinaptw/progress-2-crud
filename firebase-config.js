const firebaseConfig = {
	apiKey: "AIzaSyDGkPYbtKVtGrXz_RN06VF9lqpPgEknNdw",
	authDomain: "project-restoran-fa82c.firebaseapp.com",
	databaseURL:
		"https://project-restoran-fa82c-default-rtdb.asia-southeast1.firebasedatabase.app",
	projectId: "project-restoran-fa82c",
	storageBucket: "project-restoran-fa82c.firebasestorage.app",
	messagingSenderId: "917378606735",
	appId: "1:917378606735:web:8cfc61d2ba7db1196232fa",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();