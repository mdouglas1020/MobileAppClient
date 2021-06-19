import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { Globals } from '../../globals';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage
{
	// string for holding the value of the email input box
	email: string = ''
	// string for holding the value of the password input box
	psswd: string = ''

	constructor( private globals: Globals, public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, private toastCtrl: ToastController, private httpCtrl: Http )
	{
	}

	/* Function for determining if the login data is ready to be sent to the
	 * server for the login request
	 */
	attemptLogin(): void
	{
		if( this.inputisEmpty( this.email ) || this.inputisEmpty( this.psswd ) ) //if either are empty or fail regex test, alert user
		{
			this.showAlert( 'Input Error', 'All inputs are required' )
		}
		else
		{
			this.postRequest()
		}
	}

	/* Function for sending the login data to the server and pushing the
	 * HomePage onto the NavController if login was successfull
	 */
	postRequest(): void
	{
		let post_params = {
			email: this.email,
			pass: this.psswd
		}

		this.httpCtrl.post( this.globals.login_url, JSON.stringify( post_params ), this.globals.post_options )
		.subscribe( data => {
			let status = data[ '_body' ]
			if( status != 'true' )
			{
				this.showAlert( 'Login Failed', 'Username or Password is incorrect' )
			}
            else
            {
				// set the active user's email in localStorage
				localStorage.setItem( 'active_user', this.email )
                this.navCtrl.push( HomePage )
            }
		}, error => {
			console.log( 'error: ' + error )
		})
	}

	/* Function for alerting the user with a pop up if anything is wrong with
	 * the data or if the login attempt failed
	 */
	showAlert( title, msg ): void
	{
		let alert = this.alertCtrl.create(
			{
				title   : title,
				subTitle: msg,
				buttons : [ 'Ok' ]
			}
		)
		alert.present()
	}

	/* Function for loading the toast pop up when the user successfully
	 * registered
	 */
	showRegistrationConfirm(): void
	{
		let toast = this.toastCtrl.create(
			{
				message: 'User successfully added, now just login!',
				duration: 5000,
				position: 'middle',
				showCloseButton: true,
				closeButtonText: 'Ok'
			}
		)
		toast.present()
	}

	//called when register button is pressed
	loadRegisterPage(): void
	{
		let modal = this.modalCtrl.create( RegisterPage )

		modal.onDidDismiss( data =>
		{
			if( data.email != '' && data.psswd != '' ) //if data is empty then the registration was cancelled
			{
				this.email = data.email
				this.psswd = data.psswd
				this.showRegistrationConfirm()
			}
		})

		modal.present()
	}

	//checks if input is okay to verify
	inputisEmpty( str ): boolean
	{
		let re = /^[\w!@#$%^&*.]+$/
		return !re.test( str )
	}
}