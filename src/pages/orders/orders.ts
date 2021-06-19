import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../globals';

@Component({
    selector: 'page-orders',
    templateUrl: 'orders.html'
})
export class OrdersPage
{
    active_user: string = ''
    orders: any = []

    constructor( private globals: Globals, private viewCtrl: ViewController, private httpCtrl: Http )
    {
        this.active_user = localStorage.getItem( 'active_user' )
        this.loadOrders()
    }

    ionViewWillEnter()
    {
        this.viewCtrl.showBackButton( false )
    }

    loadOrders(): void
    {
        let post_params = {
            email: this.active_user
        }

        this.httpCtrl.post( this.globals.orders_url, JSON.stringify( post_params ), this.globals.post_options )
        .subscribe( data => {
            this.orders = JSON.parse( data[ '_body' ] )
        }, error => {
            console.log( 'Load order error: ' + error )
        })
    }

    deleteOrder(order): void
    {
      let post_params = {
        email: this.active_user,
        order_group: order.order_group
      }

      this.httpCtrl.post( this.globals.del_orders_url, JSON.stringify( post_params ), this.globals.post_options )
      .subscribe( data => {
          this.orders = []
          this.loadOrders()
          console.log(data);
      }, error => {
          console.log( 'Load order error: ' + error )
      })
    }
}