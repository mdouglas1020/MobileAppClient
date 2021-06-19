import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';
import { OrdersPage } from '../orders/orders';
import { Globals } from '../../globals';

@Component({
    selector: 'page-cart',
    templateUrl: 'cart.html'
})

export class CartPage
{
    // string for holding the active user's email
    active_user: string = ''
    // string for holding the name of the user's cart in localStorage
    active_user_cart: string = ''
    // object for holding the user's cart
    cart: any = []
    // int for holding the total cost of the cart
    cart_price: number = 0
    // string for holding the group order number from the server
    order_num: string = '-1'
    // object for holding the user's ordered products
    ordered_items: any = []
    // bool for holding the state of the confirmation card
    say_hide_confirm: boolean
    // bool for holding the state of the order confirmation card
    say_hide_order: boolean
    // bool for holding the state of the empty cart card
    say_hide_empty: boolean

    constructor( private globals: Globals, private navCtrl: NavController, private viewCtrl: ViewController, private httpCtrl: Http )
    {
        this.active_user = localStorage.getItem( 'active_user' )
        this.active_user_cart = this.active_user + '_cart'
        this.cart = ( localStorage.getItem( this.active_user_cart ) !== null ) ? JSON.parse( localStorage.getItem( this.active_user_cart ) ) : []
        this.setHiddenContent()
        this.calculatePrice()
    }

    ionViewWillEnter()
    {
        this.viewCtrl.showBackButton( false )
    }

    /* Function for determining which card should be displayed to the user
     * based on boolean values associated with the cart's current status
     */
    setHiddenContent(): void
    {
        this.say_hide_order = false
        this.say_hide_confirm = false
        this.say_hide_empty = false

        // If the cart is empty
        if( this.cart.length == 0 )
        {
            // If the order hasn't changed meaning its incomplete
            if( this.order_num == '-1' )
            {
                this.say_hide_empty = true
            }
            else
            {
                this.say_hide_order = true
            }
        }
        else
        {
            this.say_hide_confirm = true
        }
    }

    /* Function for calculating the total cost of the user's cart
     */
    calculatePrice(): void
    {
        this.cart_price = 0

        Object.keys( this.cart ).forEach( key =>
        {
            let product_count = this.cart[ key ].count
            let product_price = this.cart[ key ].price
            this.cart_price += ( product_count * product_price )
        })
    }

    /* Function for increasing the quantity of the selected product in the
     * user's cart
     */
    bumpCounter( item ): void
    {
        if( item.count < 4 )
        {
            item.count++
            this.cart_price += item.price
            this.updateCart()
        }
    }

    /* Function for decreasing the quantity of the selected product in the
     * user's cart
     */
    decrCounter( item ): void
    {
        item.count--
        this.cart_price -= item.price
        this.updateCart()
    }

    /* Function for removing products from the user's cart if the product's
     * quantity is equal to 0
     */
    updateCart(): void
    {
        let cart_name = this.active_user + '_cart'

        let temp_cart = this.cart
        this.cart = []
        Object.keys( temp_cart ).forEach( key =>
        {
            if( temp_cart[ key ].count > 0 )
            {
                this.cart.push({
                    product: temp_cart[ key ].product,
                    count  : temp_cart[ key ].count,
                    price  : temp_cart[ key ].price,
                    pic    : temp_cart[ key ].pic
                })
            }
        })
        this.setHiddenContent()
        localStorage.setItem( cart_name, JSON.stringify( this.cart ) )
    }

    /* Function for getting the group order number from the order submission
     * DB call and then loading the ordered_items object to display to the
     * user what they ordered
     */
    setOrderNum( order_group: string )
    {
        this.order_num = order_group

        Object.keys( this.cart ).forEach( key =>
        {
            this.ordered_items.push({
                product: this.cart[ key ].product,
                quantity: this.cart[ key ].count
            })
        })

        this.cart = []
        localStorage.setItem( this.active_user_cart, JSON.stringify( this.cart ) )
        this.setHiddenContent()
    }

    /* Function for sending the user's cart to the DB and creating an order.
     * The function is recursive and asynchronous because the cart requires
     * iteration through the object in order to send each product to the server.
     */
    submitOrder( order_group: string, index: number )
    {
        // Base case for if the current index has exceeded the cart's length
        if( index == this.cart.length )
        {
            /* Calls the function to set the order number and then returns to
             * break the recursive loop
             */
            this.setOrderNum( order_group )
            return
        }

        this.order_num = order_group

        let post_params = {
            product: this.cart[ index ].product,
            email: this.active_user,
            quantity: this.cart[ index ].count,
            order_group: order_group
        }

        this.httpCtrl.post( this.globals.cart_url, JSON.stringify( post_params ), this.globals.post_options )
        .subscribe( data => {
            /* Calls itself by passing the group order number received from the
             * server and the current cart index incremented by 1
             */
            this.submitOrder( data[ '_body' ], index + 1 )
        }, error => {
            console.log( 'Confirmation error: ' + error )
        })
    }

    // Function for pushing the HomePage onto the NavController
    goToHome(): void
    {
        this.navCtrl.push( HomePage )
    }

    // Function for pushing the OrdersPage onto the NavController
    goToOrders(): void
    {
        this.navCtrl.push( OrdersPage )
    }
}