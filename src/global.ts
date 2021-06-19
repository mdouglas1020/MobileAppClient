import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';

@Injectable()
export class Globals
{
    public login_url: string
    public register_url: string
    public orders_url: string
    public del_orders_url: string
    public home_url: string
    public cart_url: string
    public logout_url: string
    public post_options: RequestOptions

    constructor()
    {
        this.login_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/user/login'
        this.register_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/user/signup'
        this.orders_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/order/get_orders'
        this.del_orders_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/order/delete_order'
        this.home_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/product/products'
        this.cart_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/order/create_order'
        this.logout_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/user/logout'

        var headers = new Headers()
		headers.append( 'Accept', 'application/json' )
		headers.append( 'Content-Type', 'application/json' )
        this.post_options = new RequestOptions( { headers: headers } )
    }
}