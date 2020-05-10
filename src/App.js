import React from 'react';
import logo from './logo.svg';
import './App.css';
import ListItems from "./ListItems";
import { library } from "@fortawesome/fontawesome-svg-core";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

library.add(faTrash);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            items:[],
            currentItem:{
                text:'',
                id:''
            }
        }
        this.handleInput = this.handleInput.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.setUpdate = this.setUpdate.bind(this);
    }
    handleInput(e){
        this.setState({
            currentItem:{
                text: e.target.value,
                id: Date.now()
            }
        })
    }
    //Add new to do
    addItem(e){
        // stop page refreshing
        e.preventDefault();
        const newItem = this.state.currentItem;
        console.log(newItem);
        if (newItem.text!==""){
            const newItems=[...this.state.items, newItem];
            this.setState({
                items:newItems,
                currentItem:{
                    text:'',
                    id:''
                }
            })
        }
    }
    //Delete a to do
    deleteItem(id){
        const filteredItems = this.state.items.filter(item => item.id!==id);
        this.setState(
            {
            items:filteredItems
        })
    }
    //Update a to do
    setUpdate(text, id){
        const items = this.state.items;
        items.map(item =>{
            if(item.id === id){
                item.text=text;
            }
        })
        this.setState({
            items: items
        })
    }

  render() {
    return (
        <div className="CLS1">
            <header>
                <form id="to-do-form1" onSubmit={this.addItem}>
                    <h1>Todo List</h1>
                    <input type="text" placeholder="Enter Todo" value={this.state.currentItem.text} onChange={this.handleInput}/>
                    <button type="submit">Add</button>
                </form>
            </header>
            <ListItems items = {this.state.items} deleteItem = {this.deleteItem} setUpdate = {this.setUpdate}></ListItems>
        </div>
    );
  }
}
export default App;
