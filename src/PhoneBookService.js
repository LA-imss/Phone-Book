	export function getStorage() {
		return JSON.parse(localStorage["contacts"])
	}

	export function setStorage(info, storage = JSON.parse(localStorage["contacts"])) {
		storage.push(info);
		localStorage["contacts"] = JSON.stringify(storage);
	}

	export function removeFromStorage(id, storage = JSON.parse(localStorage["contacts"])) {
		for (let i = 0; i < storage.length; i++) {
			if (storage[i].id === id) {
				storage.splice(i, 1);
				localStorage["contacts"] = JSON.stringify(storage);
				break;
			}
		}	
	}

	export function checkInfo(name, number, numberPattern, email, emailPattern) {
		if ( name.length >= 100 || ! name.length ||  ! numberPattern.test(number)
				|| (number.length > 11) || ! emailPattern.test(email))
				return false;

		return true;
	}

	export function selectContactsGroup(itemsPerPage, page, storage) {
		let length = storage.length;
		if (length === 0)
			return false;

		let next, last; 
		let list = [];

		if ( page === 0 ) 
			next = 0;
		else
			next = itemsPerPage * page - 1;
			
		if(length <= itemsPerPage * (page +1))
			last = length -1;
		else 
			last = itemsPerPage * (page + 1) - 1;

		console.log(storage);

		for (let i = next; i <= last; i++) {
			list.push( storage[i] );
		}

		list.sort((a,b) => {
			if(a.name > b.name)
				return 1;
			if(a.name < b.name)
				return -1;
			return 0;
		});

		return list;
	}