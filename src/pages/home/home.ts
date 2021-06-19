import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { CartPage } from '../cart/cart';
import { Globals } from '../../globals';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage
{
	//string that holds the email of the active user
	active_user: string = ''
	//object that holds the products loaded form the DB
	inventory: any = []
	//number that holds the total number of products in the cart object
	cart_quantity: number = 0
	//object that holds the products that the user has added to their cart
	cart_obj: any = []

	constructor( private globals: Globals, private navCtrl: NavController, private viewCtrl: ViewController, private httpCtrl: Http )
	{
		this.active_user = localStorage.getItem( 'active_user' )
	}

	ionViewWillEnter()
	{
		//hides the back button so the user has access to the menu toggle
		this.viewCtrl.showBackButton( false )
		this.loadProducts()
	}

	/* Function for loading the list of product's and their corresponding info
	 * from the server
	 */
	loadProducts(): void
	{
		let post_params = {
			email: this.active_user
		}

		this.httpCtrl.post( this.globals.home_url, JSON.stringify( post_params ), this.globals.post_options )
		.subscribe( data => {
			this.inventory = JSON.parse( data[ '_body' ] )
			this.loadCart()
		}, error => {
			console.log( 'Error loading products: ' + error )
		})
	}

	/* Function for increasing the quantity of a product in the user's cart
	 * if that product's quantity is less than 5
	 */
	bumpCounter( item ): void
	{
		if( item.count < 4 )
		{
			this.cart_quantity++
			item.count++
			this.updateCart()
		}
	}

	/* Function for decreasing the quantity of a product in the user's cart
	 * if that product's quantity is greater than 0
	 */
	decrCounter( item ): void
	{
		if( item.count > 0 )
		{
			this.cart_quantity--
			item.count--
			this.updateCart()
		}
	}

	/* Function for loading the user's cart from localStorage and setting the
	 * UI's cart data
	 */
	loadCart(): void
	{
		let cart_name = this.active_user + '_cart'
		//loads the active user's cart
		this.cart_obj = ( localStorage.getItem( cart_name ) !== null ) ? JSON.parse( localStorage.getItem( cart_name ) ) : []

		Object.keys( this.cart_obj ).forEach( cart_key => {
			let cart_item = this.cart_obj[ cart_key ]

			Object.keys( this.inventory ).forEach( inv_key => {
				/** If the current inventory item's product name matches
				 *  the name of the current item in the user's cart then:
				 *  	1. Set the inventory item's count equal to the
				 *     	   current cart item's count
				 *  	2. Set the current cart item's price equal to
				 *         the current inventory item's price
				 *   	3. Add the current cart item's count to the total
				 *   	   number of items in the cart
				**/
				if( this.inventory[ inv_key ].product == cart_item.product )
				{
					this.inventory[ inv_key ].count = cart_item.count
					this.cart_obj[ cart_key ].price = this.inventory[ inv_key ].price
					this.cart_quantity += cart_item.count
				}
			}) //end inner for each
		}) //end outter for each
	}

	/* Function for removing products from the user's cart if their quantity
	 * is equal to 0
	 */
	updateCart(): void
	{
		let cart_name = this.active_user + '_cart'
		this.cart_obj = []

		Object.keys( this.inventory ).forEach( key => {
			let current_item = this.inventory[ key ]

			//If the current inventory item's count is greater than 0
			//then push that item onto the cart object
			if( current_item.count > 0 )
			{
				this.cart_obj.push({
					product: current_item.product,
					count  : current_item.count,
					price  : current_item.price,
					pic    : current_item.path_to_picture
				})
			}
		})

		localStorage.setItem( cart_name, JSON.stringify( this.cart_obj ) )
	}

	// Function for pushing the CartPage onto the NavController
	loadCartView(): void
	{
		this.navCtrl.push( CartPage, {
			cart : this.cart_obj
		})
	}
}