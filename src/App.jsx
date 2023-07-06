import { useEffect, useState } from 'react';
import styles from './App.module.css';
import {
	ref,
	onValue,
	push,
	set,
	remove,
	query,
	orderByValue,
} from 'firebase/database';
import { db } from './firebase';
// import { query, orderBy } from 'firebase/firestore';

export const App = () => {
	const [isCreating, setIsCreating] = useState(false);
	const [toDos, setToDos] = useState({});
	const [isUpdating, setIsUpdating] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [addName, setAddName] = useState();
	const [updateInput, setUpdateInput] = useState(false);
	const [isChanging, setIsChanging] = useState({ what: false, id: 0 });

	const deals = ref(db, 'toDos');
	const sortDeal = () => {
		query(deals, orderByValue('name'));
		console.log();
	};

	const requestDeleteDeal = (id) => {
		const deleteDeal = ref(db, `/toDos/${id}`);
		remove(deleteDeal);
	};

	const handleInputChange = (event) => {
		setAddName(event.target.value);
	};
	const handleUpdateChange = (event) => {
		setUpdateInput(event.target.value);
	};
	const requestChangeDeal = (id) => {
		setIsChanging({ what: true, id });
	};

	const requestUpdateDeal = (id) => {
		const toDoUpdateDbRef = ref(db, `toDos/${id}`);
		setIsUpdating(true);
		set(toDoUpdateDbRef, {
			name: updateInput,
		})
			.then((response) => {
				console.log(response);
			})
			.finally(() => setIsUpdating(false));
		setIsChanging({ what: false, id });
	};
	const requestAddDeal = () => {
		setIsCreating(true);
		const toDosDbRef = ref(db, 'toDos');
		push(toDosDbRef, {
			name: addName,
		})
			.then((response) => {
				console.log(response);
			})
			.finally(() => setIsCreating(false));
		setIsLoading(false);
	};

	useEffect(() => {
		setIsLoading(true);
		const toDosDbRef = ref(db, 'toDos');
		const q = query(toDosDbRef, orderByValue('name'));
		onValue(q, (snapshot) => {
			const loadedToDos = snapshot.val() || {};

			setToDos(loadedToDos);
			setIsLoading(false);
		});
		const toDoUpdateDbRef = ref(db, `toDos`);
		onValue(toDoUpdateDbRef, (snapshot) => {
			const loadedToDos = snapshot.val() || {};
			setToDos(loadedToDos);
			setIsLoading(false);
		});
	}, []);

	return (
		<div className={styles.app}>
			<div className={styles.search}>
				<label>Найти задачу</label>
				<input type="text"></input>
			</div>
			<button onClick={sortDeal}>Сортировка(А-Я)</button>
			{isLoading ? (
				<div></div>
			) : (
				Object.entries(toDos).map(([id, { name }]) => (
					<div key={id} className={styles.item}>
						<p>-</p>
						{isChanging.what && isChanging.id === id ? (
							<div>
								<input
									className={styles.update}
									type="text"
									name={name}
									onChange={handleUpdateChange}
									defaultValue={name}
								/>
								<button
									disabled={isUpdating}
									onClick={() => requestUpdateDeal(id)}
								>
									ОК
								</button>
							</div>
						) : (
							<p className={styles.deal}>{name}</p>
						)}
						<button onClick={() => requestChangeDeal(id)}>Изменить дело</button>
						<button
							className={styles.delete}
							onClick={() => requestDeleteDeal(id)}
						>
							Удалить дело
						</button>
					</div>
				))
			)}
			<form className={styles.newDeal}>
				<div>
					<label>Введите новую задачу</label>
					<input type="text" onChange={handleInputChange} />
					<button disabled={isCreating} onClick={requestAddDeal}>
						Добавить дело
					</button>
				</div>
			</form>
		</div>
	);
};
