import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {
	constructor() {
		super();
		// bind the addFish method to this class
		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.removeFish = this.removeFish.bind(this)
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);
		// in the initial state
		// the fishes state is gonna be empty
		// getInitialState in the normal JavaScript. (this is ES6)
		this.state = {
			fishes: {},
			order: {}
		};
	}

	/*
	 invoked immediately before mounting occurs.
	 It is called before render(), therefore setting state
	  in this method will not trigger a re-rendering.
	 right before app gets rendered
	 */
	componentWillMount() {
		// getting storeId from react-router
		// it is inside params which is a props of App component
		// the ref is to reference it later during un-mounting
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`,
			{
				context: this,
				state: 'fishes'
			});
		// check if there is any order in localStorage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

		if(localStorageRef){
			//update our app component order state
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	/**
	 * Runs whenever props or state changes.
	 * Using to localStore order state.
	 */
	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(`order-${this.props.params.storeId}`,
			JSON.stringify(nextState.order));
	}

	addFish(fish){
		// first take a copy of the state
		// then update our state
		// so ... is called Spread syntax
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
		const fishes = {...this.state.fishes};
		// add in our new Fish.
		// gonna use a timestamp to store fishes
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes });
	}

	updateFish(key, updatedFish) {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({ fishes });
	}

	removeFish(key) {
		const fishes = {...this.state.fishes};
		fishes[key] = null;
		this.setState({ fishes });
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		})
	}

	addToOrder(key) {
		// get a copy of the order state
		const order = {...this.state.order};
		// update order so new orders are added up
		order[key] = order[key] + 1 || 1;
		// update the state
		this.setState({ order });
	}

	removeFromOrder(key){
		const  order = {...this.state.order};
		delete order[key];
		this.setState({ order });
	}

	// whenver we put {} in JSx it means we are
	// telling react.js that we are going to be using
	// JavaScript over here.
	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood" />
					<ul className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map(key => <Fish key={key} index={key} details={this
									.state.fishes[key]} addToOrder={
										this.addToOrder
								}/>)
						}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					params={this.props.params}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory
					addFish={this.addFish}
					loadSamples={this.loadSamples}
					fishes={this.state.fishes}
					updateFish={this.updateFish}
					removeFish={this.removeFish}
				/>
			</div>
		)
	}
}

export default App;
