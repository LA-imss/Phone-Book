import React, { Component } from 'react';
import { getStorage, setStorage, removeFromStorage, checkInfo, selectContactsGroup} from './PhoneBookService';

export default class PhoneBook extends Component {

	 constructor() {
	 	super();
	 	this.state = {contacts: this.list() || [],
	 				  name: "",
	 				  number: "",
	 				  email: "",
	 				  search: ""
	 				};
	 	this.itemsPerPage;
	 	this.page;

	   this.onInputChange = this.onInputChange.bind(this);
	   this.onRemove = this.onRemove.bind(this);
	   this.onAdd = this.onAdd.bind(this);
	   this.onSearch = this.onSearch.bind(this);
	   this.add = this.add.bind(this);
	   this.remove = this.remove.bind(this);
	   this.search = this.search.bind(this);
	   this.list = this.list.bind(this);
	 }


	onInputChange(event) {
      const name = event.target.name;
      const value = event.target.value;
      this.setState({[name]: value});
    }

    onRemove(e) {
    	let id = e.target.parentElement.id;
		let index;
		for (let i = 0; i < this.state.contacts.length; i++)
			{
				if (this.state.contacts[i].id === id) {
					index = i;
					break;
				}
			}
		this.remove(index, id);
    }

    onAdd(e) {
    	e.preventDefault();
		let name, number, email;
		name = this.state.name;
		number = this.state.number;
		email = this.state.email;
		this.add({name, number, email})
    }

    onSearch(e) {
    	this.search(this.state.search);
    }

	add(contactInfo ={}) {

		let storage = (localStorage["contacts"] !== undefined) ? getStorage() : [];
		if ( storage.length >= 10000) {
			return;
		}

		let name = contactInfo.name.trim().toLowerCase().split(" ")
											.map((item) => item[0].toUpperCase() + item.slice(1))
											.join(" ");

		let number = contactInfo.number.trim();
		let email = contactInfo.email.trim();
		let emailPattern = /^[0-9a-z-_\.]+\@[0-9a-z-]{2,}\.[a-z]{2,}$/i;
		let numberPattern = /[0-9]{2}-[0-9]{3}-[0-9]{4}/;

		if ( ! checkInfo(name, number, numberPattern, email, emailPattern) )
			return;

		let id = name + number + email;

		for(let i = 0; i < storage.length; i++) {
			if(storage[i].id === id)
				return;
		}

		let info = {name, number, email, id};

		if(this.state.contacts.length < this.itemsPerPage) {
			this.setState((prevState) => (
				{ contacts: [...prevState.contacts, info] }
			));	
		}

		setStorage(info, storage);
	}

	remove(index, id){

		this.setState((prevState) => {
			prevState.contacts.splice(index, 1);
			return ({contacts: prevState.contacts});
		});
		removeFromStorage(id);
	}

	search(query) {
		let string = query.trim();

		if(localStorage["contacts"] === undefined || getStorage().length === 0)
			return;

		let storage = getStorage();
		let list = [];
		let pattern = new RegExp(`.*${string}.*`, "i");

		console.log(storage);
		for(let i = 0; i < storage.length; i++) {
			let name = storage[i].name;
			let number = storage[i].number;

			if( pattern.test(name) || pattern.test(number))
				list.push(storage[i]);	
		}
				console.log(list);

		let searchList = selectContactsGroup(this.itemsPerPage, this.page, list);
		if(! searchList)
			return;

		this.setState({contacts: searchList});
		return searchList; 

	}

	list(itemsPerPage = 10, page = 0) {
		this.itemsPerPage = itemsPerPage;
		this.page = page;

		if(localStorage["contacts"] === undefined)
			return;
		let storage = getStorage();

		let list = selectContactsGroup(itemsPerPage, page, storage);
		if(! list)
			return;

		return list;
	}

	render() {
		return (
		<div className="phonebook">
			<h1>Phone book</h1>

			<form className="form"> 
				<input type="text" name="name" className="input" placeholder="Name" 
					value={this.state.name} onChange={this.onInputChange}/>
          		<input type="text" name="number" className="input" placeholder="Number: xx-xxx-xxxx" 
          			value={this.state.number} onChange={this.onInputChange}/>
            	<input type="email" name="email" className="input" placeholder="E-mail" 
            		value={this.state.email} onChange={this.onInputChange}/>
         		<button className="btn-add" onClick={this.onAdd}>Add contact</button>	
         	</form>

         <div className="search">
         	<input type="search" name="search" className="input" placeholder="search" value={this.state.search} onChange={this.onInputChange}/>
         	<button className="btn-search" onClick={this.onSearch}>Go</button>
         </div>

         <ul className="list">
         	<li className="list-item">
         		<span className="detail">Name</span>
				<span className="detail">Number</span>
				<span className="detail">E-mail</span>
			</li>
         	{ (this.state.contacts.length === 0) ? <span>Contacts list is empty</span> :
         	 	this.state.contacts.map((contact) => {
    				let key = contact.id;
   				 return <li className="list-item" key={key} id={key}>
									<span className="detail">{contact.name}</span>
									<span className="detail">{contact.number}</span>
									<span className="detail">{contact.email}</span>
									<button className="btn-remove" onClick={this.onRemove}>X</button>
								</li>;
  					}
  				)}
         </ul>
		</div>
		)
	}
}

