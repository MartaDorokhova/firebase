import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyByHtWq-Wj1UVHVlJ5q9WUs2j_PoFTqtJs',
	authDomain: 'todolist-9da52.firebaseapp.com',
	projectId: 'todolist-9da52',
	storageBucket: 'todolist-9da52.appspot.com',
	messagingSenderId: '60526608702',
	appId: '1:60526608702:web:1e09714db09d36cd7d2c6f',
	databaseURL: `https://todolist-9da52-default-rtdb.europe-west1.firebasedatabase.app/`,
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
