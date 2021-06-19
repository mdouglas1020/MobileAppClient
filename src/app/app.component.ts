import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { OrdersPage } from '../pages/orders/orders';
import { CartPage } from '../pages/cart/cart';

import { Globals } from '../globals';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor( private globals: Globals, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private httpCtrl: Http ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      //{ title: 'Login', component: LoginPage },
      { title: 'Home', component: HomePage },
      { title: 'Orders', component: OrdersPage },
      { title: 'Cart', component: CartPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(): void
  {
      let active_user = localStorage.getItem( 'active_user' )
      localStorage.setItem( 'active_user', '' )

      /*var headers = new Headers()
      headers.append( 'Accept', 'application/json' )
      headers.append( 'Content-Type', 'application/json' )
      let options = new RequestOptions( { headers: headers } )*/

      let post_params = {
          email: active_user
      }

      this.httpCtrl.post( this.globals.logout_url, JSON.stringify( post_params ), this.globals.post_options )
      .subscribe( data => {
          console.log( data[ '_body' ] )
          this.nav.setRoot( LoginPage );
      }, error => {
          console.log( error )
      })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}