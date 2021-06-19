import { Component } from '@angular/core';
import { ViewController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Globals } from '../../globals';

@Component({
	selector: 'page-register',
	templateUrl: 'register.html',
})
export class RegisterPage
{
	// string for holding the value of the username input box
	usrnm: string = ''
	// string for holding the value of the email input box
	email: string = ''
	// string for holding the value of the password input box
	psswd: string = ''
	// string for holding the value of the confirm password input box
	cnfrm: string = ''

	constructor( private globals: Globals, private viewCtrl: ViewController, private alertCtrl: AlertController, private httpCtrl: Http )
	{
	}

	/* Function for validating all of the input boxes before attempting to
	 * send the registration reques to the server
	 */
	attemptRegistration(): void
	{
		let credentials = { usrnm: this.usrnm, email: this.email, psswd: this.psswd, cnfrm: this.cnfrm } //make object from login info for simpler access when validating
		var flag: boolean = true

		Object.keys( credentials ).forEach( key =>
		{
			if( this.isEmpty( credentials[ key ] ) )
			{
				flag = false
			}
		})

		if( !flag )
		{
			this.showAlert( 'Invlalid Inputs', 'All inputs are required' )
		}
		else if( !this.verifyEmail() )
		{
			this.showAlert( 'Email Error', "Valid emails must include an '@' followed by the domain" )
		}
		else if( this.psswd != this.cnfrm )
		{
			this.showAlert( 'Password Error', 'Passwords must match' )
		}
		else
		{
			this.sendRegistrationRequest()
		}
	}

	/* Function for sending the registration data to the server and dismissing
	 * the modal if the registration was successfull
	 */
	sendRegistrationRequest(): void
	{
		let post_params = {
			alias: this.usrnm,
			email: this.email,
			pass : this.psswd
		}

		this.httpCtrl.post( this.globals.register_url, JSON.stringify( post_params ), this.globals.post_options )
		.subscribe( data => {
			let status = data[ '_body' ]
			if( status != '' )
			{
				this.showAlert( 'Registration Failed', status )
			}
			else
			{
				// Passes the registered email and password back for quick login
				this.viewCtrl.dismiss( { email: this.email, psswd: this.psswd } )
			}
		}, error => {
			console.log( 'ERROR: ' + error )
		})
	}

	/* Function for displaying a pop up to the user if anything is wrong with
	 * the registration process
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

	/* Function for regex testing the email string to determine if it contains
	 * all of the necessary parts of a proper email
	 */
	verifyEmail(): boolean
	{
		//confirms the email consists of 'string'-'@'-'string'-'.'-'string'
		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return re.test( this.email )
	}

	/* Function for regex testing all of the input strings to determine if they
	 * contain spaces
	 */
	isEmpty( str ): boolean
	{
		//fails if even a space is in the input
		let re = /^$/
		return re.test( str )
	}

	//called when the user presses cancel
	dismiss(): void
	{
		this.viewCtrl.dismiss( { email: '', psswd: '' } )
	}

}