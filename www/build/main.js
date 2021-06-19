webpackJsonp([0],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CartPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__orders_orders__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__globals__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CartPage = (function () {
    function CartPage(globals, navCtrl, viewCtrl, httpCtrl) {
        this.globals = globals;
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.httpCtrl = httpCtrl;
        // string for holding the active user's email
        this.active_user = '';
        // string for holding the name of the user's cart in localStorage
        this.active_user_cart = '';
        // object for holding the user's cart
        this.cart = [];
        // int for holding the total cost of the cart
        this.cart_price = 0;
        // string for holding the group order number from the server
        this.order_num = '-1';
        // object for holding the user's ordered products
        this.ordered_items = [];
        this.active_user = localStorage.getItem('active_user');
        this.active_user_cart = this.active_user + '_cart';
        this.cart = (localStorage.getItem(this.active_user_cart) !== null) ? JSON.parse(localStorage.getItem(this.active_user_cart)) : [];
        this.setHiddenContent();
        this.calculatePrice();
    }
    CartPage.prototype.ionViewWillEnter = function () {
        this.viewCtrl.showBackButton(false);
    };
    /* Function for determining which card should be displayed to the user
     * based on boolean values associated with the cart's current status
     */
    CartPage.prototype.setHiddenContent = function () {
        this.say_hide_order = false;
        this.say_hide_confirm = false;
        this.say_hide_empty = false;
        // If the cart is empty
        if (this.cart.length == 0) {
            // If the order hasn't changed meaning its incomplete
            if (this.order_num == '-1') {
                this.say_hide_empty = true;
            }
            else {
                this.say_hide_order = true;
            }
        }
        else {
            this.say_hide_confirm = true;
        }
    };
    /* Function for calculating the total cost of the user's cart
     */
    CartPage.prototype.calculatePrice = function () {
        var _this = this;
        this.cart_price = 0;
        Object.keys(this.cart).forEach(function (key) {
            var product_count = _this.cart[key].count;
            var product_price = _this.cart[key].price;
            _this.cart_price += (product_count * product_price);
        });
    };
    /* Function for increasing the quantity of the selected product in the
     * user's cart
     */
    CartPage.prototype.bumpCounter = function (item) {
        if (item.count < 4) {
            item.count++;
            this.cart_price += item.price;
            this.updateCart();
        }
    };
    /* Function for decreasing the quantity of the selected product in the
     * user's cart
     */
    CartPage.prototype.decrCounter = function (item) {
        item.count--;
        this.cart_price -= item.price;
        this.updateCart();
    };
    /* Function for removing products from the user's cart if the product's
     * quantity is equal to 0
     */
    CartPage.prototype.updateCart = function () {
        var _this = this;
        var cart_name = this.active_user + '_cart';
        var temp_cart = this.cart;
        this.cart = [];
        Object.keys(temp_cart).forEach(function (key) {
            if (temp_cart[key].count > 0) {
                _this.cart.push({
                    product: temp_cart[key].product,
                    count: temp_cart[key].count,
                    price: temp_cart[key].price,
                    pic: temp_cart[key].pic
                });
            }
        });
        this.setHiddenContent();
        localStorage.setItem(cart_name, JSON.stringify(this.cart));
    };
    /* Function for getting the group order number from the order submission
     * DB call and then loading the ordered_items object to display to the
     * user what they ordered
     */
    CartPage.prototype.setOrderNum = function (order_group) {
        var _this = this;
        this.order_num = order_group;
        Object.keys(this.cart).forEach(function (key) {
            _this.ordered_items.push({
                product: _this.cart[key].product,
                quantity: _this.cart[key].count
            });
        });
        this.cart = [];
        localStorage.setItem(this.active_user_cart, JSON.stringify(this.cart));
        this.setHiddenContent();
    };
    /* Function for sending the user's cart to the DB and creating an order.
     * The function is recursive and asynchronous because the cart requires
     * iteration through the object in order to send each product to the server.
     */
    CartPage.prototype.submitOrder = function (order_group, index) {
        var _this = this;
        // Base case for if the current index has exceeded the cart's length
        if (index == this.cart.length) {
            /* Calls the function to set the order number and then returns to
             * break the recursive loop
             */
            this.setOrderNum(order_group);
            return;
        }
        this.order_num = order_group;
        var post_params = {
            product: this.cart[index].product,
            email: this.active_user,
            quantity: this.cart[index].count,
            order_group: order_group
        };
        this.httpCtrl.post(this.globals.cart_url, JSON.stringify(post_params), this.globals.post_options)
            .subscribe(function (data) {
            /* Calls itself by passing the group order number received from the
             * server and the current cart index incremented by 1
             */
            _this.submitOrder(data['_body'], index + 1);
        }, function (error) {
            console.log('Confirmation error: ' + error);
        });
    };
    // Function for pushing the HomePage onto the NavController
    CartPage.prototype.goToHome = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */]);
    };
    // Function for pushing the OrdersPage onto the NavController
    CartPage.prototype.goToOrders = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__orders_orders__["a" /* OrdersPage */]);
    };
    CartPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cart',template:/*ion-inline-start:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\cart\cart.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Cart</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content bg-color="red">\n\n    <ion-list>\n\n        <ion-item *ngFor="let item of cart" bg-color="pink">\n\n            <ion-thumbnail item-start>\n\n                <img src={{item.pic}} />\n\n            </ion-thumbnail>\n\n            <h2>{{item.product}} (x{{item.count}})</h2>\n\n            <p>$ {{item.price * item.count}}</p>\n\n            <button ion-button id="add-btn" item-end (click)="bumpCounter(item)">\n\n                <ion-icon name="md-add-circle"></ion-icon>\n\n            </button>\n\n            <button ion-button id="sub-btn" item-end (click)="decrCounter(item)">\n\n                <ion-icon name="md-remove-circle"></ion-icon>\n\n            </button>\n\n        </ion-item>\n\n    </ion-list>\n\n\n\n    <!-- Card for showing the user their total and the confirm button -->\n\n    <ion-card bg-color="pink" *ngIf="say_hide_confirm">\n\n        <ion-card-content>\n\n            <h2>User: {{active_user}}</h2>\n\n            <h2>Total: $ {{cart_price}}</h2>\n\n            <hr>\n\n            <button ion-button class="cart-btn" (click)="submitOrder(\'-1\',0)">Confirm</button>\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n    <!-- Card for showing the user their order number after confirming their purchase and showing the orders button -->\n\n    <ion-card bg-color="pink" *ngIf="say_hide_order">\n\n        <ion-card-content>\n\n            <h2>Your order group: {{order_num}}</h2>\n\n            <div *ngFor="let item of ordered_items">\n\n                <h3>{{item.product}} (x{{item.quantity}})</h3>\n\n            </div>\n\n            <hr>\n\n            <button ion-button class="cart-btn" (click)="goToOrders()">Go to your orders</button>\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n    <!-- Card for showing the user that their cart is empty and showing the home button -->\n\n    <ion-card bg-color="pink" *ngIf="say_hide_empty">\n\n        <ion-card-content>\n\n            <h2>Looks like your carts empty!</h2>\n\n            <hr>\n\n            <button ion-button class="cart-btn" (click)="goToHome()">Continue shopping</button>\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n</ion-content>\n\n`/*ion-inline-end:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\cart\cart.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__globals__["a" /* Globals */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */]])
    ], CartPage);
    return CartPage;
}());

//# sourceMappingURL=cart.js.map

/***/ }),

/***/ 103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrdersPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__globals__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OrdersPage = (function () {
    function OrdersPage(globals, viewCtrl, httpCtrl) {
        this.globals = globals;
        this.viewCtrl = viewCtrl;
        this.httpCtrl = httpCtrl;
        this.active_user = '';
        this.orders = [];
        this.active_user = localStorage.getItem('active_user');
        this.loadOrders();
    }
    OrdersPage.prototype.ionViewWillEnter = function () {
        this.viewCtrl.showBackButton(false);
    };
    OrdersPage.prototype.loadOrders = function () {
        var _this = this;
        var post_params = {
            email: this.active_user
        };
        this.httpCtrl.post(this.globals.orders_url, JSON.stringify(post_params), this.globals.post_options)
            .subscribe(function (data) {
            _this.orders = JSON.parse(data['_body']);
        }, function (error) {
            console.log('Load order error: ' + error);
        });
    };
    OrdersPage.prototype.deleteOrder = function (order) {
        var _this = this;
        var post_params = {
            email: this.active_user,
            order_group: order.order_group
        };
        this.httpCtrl.post(this.globals.del_orders_url, JSON.stringify(post_params), this.globals.post_options)
            .subscribe(function (data) {
            _this.orders = [];
            _this.loadOrders();
            console.log(data);
        }, function (error) {
            console.log('Load order error: ' + error);
        });
    };
    OrdersPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-orders',template:/*ion-inline-start:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\orders\orders.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Orders</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content bg-color="red">\n\n    <ion-list>\n\n        <ion-card *ngFor="let order of orders" bg-color="pink">\n\n            <ion-card-content>\n\n                <ion-card-title>\n\n                    Order number: {{order.order_num}}\n\n                </ion-card-title>\n\n                <hr />\n\n                <h4>Order date: {{order.date}}</h4>\n\n                <h4>Order group: {{order.order_group}}</h4>\n\n                <h4>Product(s): {{order.fk_product}}</h4>\n\n                <h4>Order quantity: {{order.quantity}}</h4>\n\n                <button type="button" ion-button round item-end id="delete_btn" (click)="deleteOrder(order)">Delete</button>\n\n            </ion-card-content>\n\n        </ion-card>\n\n    </ion-list>\n\n</ion-content>\n\n`/*ion-inline-end:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\orders\orders.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__globals__["a" /* Globals */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */]])
    ], OrdersPage);
    return OrdersPage;
}());

//# sourceMappingURL=orders.js.map

/***/ }),

/***/ 114:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 114;

/***/ }),

/***/ 155:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 155;

/***/ }),

/***/ 199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__register_register__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__globals__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LoginPage = (function () {
    function LoginPage(globals, navCtrl, modalCtrl, alertCtrl, toastCtrl, httpCtrl) {
        this.globals = globals;
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.httpCtrl = httpCtrl;
        // string for holding the value of the email input box
        this.email = '';
        // string for holding the value of the password input box
        this.psswd = '';
    }
    /* Function for determining if the login data is ready to be sent to the
     * server for the login request
     */
    LoginPage.prototype.attemptLogin = function () {
        if (this.inputisEmpty(this.email) || this.inputisEmpty(this.psswd)) {
            this.showAlert('Input Error', 'All inputs are required');
        }
        else {
            this.postRequest();
        }
    };
    /* Function for sending the login data to the server and pushing the
     * HomePage onto the NavController if login was successfull
     */
    LoginPage.prototype.postRequest = function () {
        var _this = this;
        var post_params = {
            email: this.email,
            pass: this.psswd
        };
        this.httpCtrl.post(this.globals.login_url, JSON.stringify(post_params), this.globals.post_options)
            .subscribe(function (data) {
            var status = data['_body'];
            if (status != 'true') {
                _this.showAlert('Login Failed', 'Username or Password is incorrect');
            }
            else {
                // set the active user's email in localStorage
                localStorage.setItem('active_user', _this.email);
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */]);
            }
        }, function (error) {
            console.log('error: ' + error);
        });
    };
    /* Function for alerting the user with a pop up if anything is wrong with
     * the data or if the login attempt failed
     */
    LoginPage.prototype.showAlert = function (title, msg) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: ['Ok']
        });
        alert.present();
    };
    /* Function for loading the toast pop up when the user successfully
     * registered
     */
    LoginPage.prototype.showRegistrationConfirm = function () {
        var toast = this.toastCtrl.create({
            message: 'User successfully added, now just login!',
            duration: 5000,
            position: 'middle',
            showCloseButton: true,
            closeButtonText: 'Ok'
        });
        toast.present();
    };
    //called when register button is pressed
    LoginPage.prototype.loadRegisterPage = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__register_register__["a" /* RegisterPage */]);
        modal.onDidDismiss(function (data) {
            if (data.email != '' && data.psswd != '') {
                _this.email = data.email;
                _this.psswd = data.psswd;
                _this.showRegistrationConfirm();
            }
        });
        modal.present();
    };
    //checks if input is okay to verify
    LoginPage.prototype.inputisEmpty = function (str) {
        var re = /^[\w!@#$%^&*.]+$/;
        return !re.test(str);
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\login\login.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>Login</ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content bg-color="red">\n\n    <form (ngSubmit)="attemptLogin()">\n\n\n\n        <!-- Card for text inputs -->\n\n        <ion-card class="input-card">\n\n            <ion-card-content>\n\n                <ion-grid>\n\n                    <ion-row>\n\n                        <ion-col>\n\n                            <ion-item class="login-input">\n\n                                <ion-input type="text" placeholder="Email" [(ngModel)]="email" name="email"></ion-input>\n\n                            </ion-item>\n\n                            <ion-item class="login-input">\n\n                                <ion-input type="password" placeholder="Password" [(ngModel)]="psswd" name="psswd"></ion-input>\n\n                            </ion-item>\n\n                        </ion-col>\n\n                    </ion-row>\n\n                </ion-grid>\n\n            </ion-card-content>\n\n        </ion-card>\n\n\n\n        <!-- Card for login and register buttons -->\n\n        <ion-card class="input-card">\n\n            <ion-card-content>\n\n                <ion-grid>\n\n                    <ion-row>\n\n                        <ion-col>\n\n                            <button type="submit" ion-button round item-start id="login_btn">Login</button>\n\n                        </ion-col>\n\n                        <ion-col>\n\n                            <button type="button" ion-button round item-end id="register_btn" (click)="loadRegisterPage()">Register</button>\n\n                        </ion-col>\n\n                    </ion-row>\n\n                </ion-grid>\n\n            </ion-card-content>\n\n        </ion-card>\n\n\n\n    </form>\n\n    <div h-align="center">\n\n        <img img-size="logo" src="assets/imgs/ws.png" align="bottom"/>\n\n    </div>\n\n</ion-content>\n\n`/*ion-inline-end:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\login\login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__globals__["a" /* Globals */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__globals__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var RegisterPage = (function () {
    function RegisterPage(globals, viewCtrl, alertCtrl, httpCtrl) {
        this.globals = globals;
        this.viewCtrl = viewCtrl;
        this.alertCtrl = alertCtrl;
        this.httpCtrl = httpCtrl;
        // string for holding the value of the username input box
        this.usrnm = '';
        // string for holding the value of the email input box
        this.email = '';
        // string for holding the value of the password input box
        this.psswd = '';
        // string for holding the value of the confirm password input box
        this.cnfrm = '';
    }
    /* Function for validating all of the input boxes before attempting to
     * send the registration reques to the server
     */
    RegisterPage.prototype.attemptRegistration = function () {
        var _this = this;
        var credentials = { usrnm: this.usrnm, email: this.email, psswd: this.psswd, cnfrm: this.cnfrm }; //make object from login info for simpler access when validating
        var flag = true;
        Object.keys(credentials).forEach(function (key) {
            if (_this.isEmpty(credentials[key])) {
                flag = false;
            }
        });
        if (!flag) {
            this.showAlert('Invlalid Inputs', 'All inputs are required');
        }
        else if (!this.verifyEmail()) {
            this.showAlert('Email Error', "Valid emails must include an '@' followed by the domain");
        }
        else if (this.psswd != this.cnfrm) {
            this.showAlert('Password Error', 'Passwords must match');
        }
        else {
            this.sendRegistrationRequest();
        }
    };
    /* Function for sending the registration data to the server and dismissing
     * the modal if the registration was successfull
     */
    RegisterPage.prototype.sendRegistrationRequest = function () {
        var _this = this;
        var post_params = {
            alias: this.usrnm,
            email: this.email,
            pass: this.psswd
        };
        this.httpCtrl.post(this.globals.register_url, JSON.stringify(post_params), this.globals.post_options)
            .subscribe(function (data) {
            var status = data['_body'];
            if (status != '') {
                _this.showAlert('Registration Failed', status);
            }
            else {
                // Passes the registered email and password back for quick login
                _this.viewCtrl.dismiss({ email: _this.email, psswd: _this.psswd });
            }
        }, function (error) {
            console.log('ERROR: ' + error);
        });
    };
    /* Function for displaying a pop up to the user if anything is wrong with
     * the registration process
     */
    RegisterPage.prototype.showAlert = function (title, msg) {
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: msg,
            buttons: ['Ok']
        });
        alert.present();
    };
    /* Function for regex testing the email string to determine if it contains
     * all of the necessary parts of a proper email
     */
    RegisterPage.prototype.verifyEmail = function () {
        //confirms the email consists of 'string'-'@'-'string'-'.'-'string'
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.email);
    };
    /* Function for regex testing all of the input strings to determine if they
     * contain spaces
     */
    RegisterPage.prototype.isEmpty = function (str) {
        //fails if even a space is in the input
        var re = /^$/;
        return re.test(str);
    };
    //called when the user presses cancel
    RegisterPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss({ email: '', psswd: '' });
    };
    RegisterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-register',template:/*ion-inline-start:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\register\register.html"*/`<ion-header>\n\n	<ion-navbar>\n\n		<ion-title>Register</ion-title>\n\n	</ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content bg-color="maroon">\n\n	<form (ngSubmit)="attemptRegistration()">\n\n\n\n		<!-- Card for text inputs -->\n\n		<ion-card class="input-card">\n\n			<ion-card-content>\n\n				<ion-grid>\n\n					<ion-row>\n\n						<ion-col>\n\n							<ion-item class="home-input">\n\n								<ion-input type="text" placeholder="Username" [(ngModel)]="usrnm" name="usrnm"></ion-input>\n\n							</ion-item>\n\n							<ion-item class="home-input">\n\n								<ion-input type="text" placeholder="Email" [(ngModel)]="email" name="email"></ion-input>\n\n							</ion-item>\n\n							<ion-item class="home-input">\n\n								<ion-input type="password" placeholder="Password" [(ngModel)]="psswd" name="psswd"></ion-input>\n\n							</ion-item>\n\n							<ion-item class="home-input">\n\n								<ion-input type="password" placeholder="Confirm Password" [(ngModel)]="cnfrm" name="cnfrm"></ion-input>\n\n							</ion-item>\n\n						</ion-col>\n\n					</ion-row>\n\n				</ion-grid>\n\n			</ion-card-content>\n\n		</ion-card>\n\n\n\n		<!-- Card for cancel and confirm buttons -->\n\n		<ion-card class="input-card">\n\n			<ion-card-content>\n\n				<ion-grid>\n\n					<ion-row>\n\n						<ion-col>\n\n							<button type="submit" ion-button round item-start id="confirm_btn">Confirm</button>\n\n						</ion-col>\n\n						<ion-col>\n\n							<button type="button" ion-button round item-end id="cancel_btn" (click)="dismiss()">Cancel</button>\n\n						</ion-col>\n\n					</ion-row>\n\n				</ion-grid>\n\n			</ion-card-content>\n\n		</ion-card>\n\n		\n\n	</form>	\n\n</ion-content>\n\n`/*ion-inline-end:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\register\register.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__globals__["a" /* Globals */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ViewController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */]])
    ], RegisterPage);
    return RegisterPage;
}());

//# sourceMappingURL=register.js.map

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(225);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(268);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_register_register__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_login_login__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_cart_cart__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_orders_orders__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__globals__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__angular_http__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_cart_cart__["a" /* CartPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_orders_orders__["a" /* OrdersPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_12__angular_http__["c" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_5__pages_register_register__["a" /* RegisterPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_cart_cart__["a" /* CartPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_orders_orders__["a" /* OrdersPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_9__globals__["a" /* Globals */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 268:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_login_login__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_orders_orders__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_cart_cart__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__globals__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MyApp = (function () {
    function MyApp(globals, platform, statusBar, splashScreen, httpCtrl) {
        this.globals = globals;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.httpCtrl = httpCtrl;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            //{ title: 'Login', component: LoginPage },
            { title: 'Home', component: __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */] },
            { title: 'Orders', component: __WEBPACK_IMPORTED_MODULE_7__pages_orders_orders__["a" /* OrdersPage */] },
            { title: 'Cart', component: __WEBPACK_IMPORTED_MODULE_8__pages_cart_cart__["a" /* CartPage */] }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.logout = function () {
        var _this = this;
        var active_user = localStorage.getItem('active_user');
        localStorage.setItem('active_user', '');
        /*var headers = new Headers()
        headers.append( 'Accept', 'application/json' )
        headers.append( 'Content-Type', 'application/json' )
        let options = new RequestOptions( { headers: headers } )*/
        var post_params = {
            email: active_user
        };
        this.httpCtrl.post(this.globals.logout_url, JSON.stringify(post_params), this.globals.post_options)
            .subscribe(function (data) {
            console.log(data['_body']);
            _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */]);
        }, function (error) {
            console.log(error);
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\app\app.html"*/`<ion-menu [content]="content" persistent=true>\n\n    <ion-header>\n\n        <ion-toolbar>\n\n            <ion-title>Menu</ion-title>\n\n        </ion-toolbar>\n\n    </ion-header>\n\n\n\n    <ion-content bg-color="lred">\n\n        <ion-list>\n\n            <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)" class="menu-item">\n\n                {{p.title}}\n\n            </button>\n\n        </ion-list>\n\n    </ion-content>\n\n    <ion-footer>\n\n        <ion-toolbar>\n\n            <button type="button" menuClose round id="logout_btn" (click)="logout()"><strong>Logout</strong></button>\n\n        </ion-toolbar>\n\n    </ion-footer>\n\n\n\n</ion-menu>\n\n\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n\n`/*ion-inline-end:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_9__globals__["a" /* Globals */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_4__angular_http__["b" /* Http */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Globals; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Globals = (function () {
    function Globals() {
        this.login_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/user/login';
        this.register_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/user/signup';
        this.orders_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/order/get_orders';
        this.del_orders_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/order/delete_order';
        this.home_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/product/products';
        this.cart_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/order/create_order';
        this.logout_url = 'http://ec2-54-244-76-150.us-west-2.compute.amazonaws.com:3000/user/logout';
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/json');
        this.post_options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* RequestOptions */]({ headers: headers });
    }
    Globals = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], Globals);
    return Globals;
}());

//# sourceMappingURL=globals.js.map

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__cart_cart__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__globals__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HomePage = (function () {
    function HomePage(globals, navCtrl, viewCtrl, httpCtrl) {
        this.globals = globals;
        this.navCtrl = navCtrl;
        this.viewCtrl = viewCtrl;
        this.httpCtrl = httpCtrl;
        //string that holds the email of the active user
        this.active_user = '';
        //object that holds the products loaded form the DB
        this.inventory = [];
        //number that holds the total number of products in the cart object
        this.cart_quantity = 0;
        //object that holds the products that the user has added to their cart
        this.cart_obj = [];
        this.active_user = localStorage.getItem('active_user');
    }
    HomePage.prototype.ionViewWillEnter = function () {
        //hides the back button so the user has access to the menu toggle
        this.viewCtrl.showBackButton(false);
        this.loadProducts();
    };
    /* Function for loading the list of product's and their corresponding info
     * from the server
     */
    HomePage.prototype.loadProducts = function () {
        var _this = this;
        var post_params = {
            email: this.active_user
        };
        this.httpCtrl.post(this.globals.home_url, JSON.stringify(post_params), this.globals.post_options)
            .subscribe(function (data) {
            _this.inventory = JSON.parse(data['_body']);
            _this.loadCart();
        }, function (error) {
            console.log('Error loading products: ' + error);
        });
    };
    /* Function for increasing the quantity of a product in the user's cart
     * if that product's quantity is less than 5
     */
    HomePage.prototype.bumpCounter = function (item) {
        if (item.count < 4) {
            this.cart_quantity++;
            item.count++;
            this.updateCart();
        }
    };
    /* Function for decreasing the quantity of a product in the user's cart
     * if that product's quantity is greater than 0
     */
    HomePage.prototype.decrCounter = function (item) {
        if (item.count > 0) {
            this.cart_quantity--;
            item.count--;
            this.updateCart();
        }
    };
    /* Function for loading the user's cart from localStorage and setting the
     * UI's cart data
     */
    HomePage.prototype.loadCart = function () {
        var _this = this;
        var cart_name = this.active_user + '_cart';
        //loads the active user's cart
        this.cart_obj = (localStorage.getItem(cart_name) !== null) ? JSON.parse(localStorage.getItem(cart_name)) : [];
        Object.keys(this.cart_obj).forEach(function (cart_key) {
            var cart_item = _this.cart_obj[cart_key];
            Object.keys(_this.inventory).forEach(function (inv_key) {
                /** If the current inventory item's product name matches
                 *  the name of the current item in the user's cart then:
                 *  	1. Set the inventory item's count equal to the
                 *     	   current cart item's count
                 *  	2. Set the current cart item's price equal to
                 *         the current inventory item's price
                 *   	3. Add the current cart item's count to the total
                 *   	   number of items in the cart
                **/
                if (_this.inventory[inv_key].product == cart_item.product) {
                    _this.inventory[inv_key].count = cart_item.count;
                    _this.cart_obj[cart_key].price = _this.inventory[inv_key].price;
                    _this.cart_quantity += cart_item.count;
                }
            }); //end inner for each
        }); //end outter for each
    };
    /* Function for removing products from the user's cart if their quantity
     * is equal to 0
     */
    HomePage.prototype.updateCart = function () {
        var _this = this;
        var cart_name = this.active_user + '_cart';
        this.cart_obj = [];
        Object.keys(this.inventory).forEach(function (key) {
            var current_item = _this.inventory[key];
            //If the current inventory item's count is greater than 0
            //then push that item onto the cart object
            if (current_item.count > 0) {
                _this.cart_obj.push({
                    product: current_item.product,
                    count: current_item.count,
                    price: current_item.price,
                    pic: current_item.path_to_picture
                });
            }
        });
        localStorage.setItem(cart_name, JSON.stringify(this.cart_obj));
    };
    // Function for pushing the CartPage onto the NavController
    HomePage.prototype.loadCartView = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__cart_cart__["a" /* CartPage */], {
            cart: this.cart_obj
        });
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\home\home.html"*/`<ion-header>\n\n    <ion-navbar>\n\n        <button ion-button menuToggle>\n\n            <ion-icon name="menu"></ion-icon>\n\n        </button>\n\n        <ion-title>Home</ion-title>\n\n        <ion-buttons end>\n\n            <button ion-button (click)="loadCartView()">\n\n                <ion-icon name="md-cart" clear></ion-icon>\n\n                <ion-badge>{{cart_quantity}}</ion-badge>\n\n            </button>\n\n        </ion-buttons>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content bg-color="red">\n\n    <ion-card bg-color="pink" *ngFor="let item of inventory">\n\n        <img src={{item.path_to_picture}} />\n\n        <ion-card-content>\n\n            <ion-card-title card-title>\n\n                {{item.product}} - $ {{item.price}}\n\n            </ion-card-title>\n\n            <p card-description>\n\n                {{item.description}}\n\n            </p>\n\n            <hr>\n\n            <ion-grid card-buttons>\n\n                <ion-row>\n\n                    <ion-col>\n\n                        <button ion-button id="add-btn" (click)="bumpCounter( item )">\n\n                            <ion-icon name="md-add-circle"></ion-icon>\n\n                        </button>\n\n                    </ion-col>\n\n                    <ion-col>\n\n                        <strong quantity>{{item.count}}</strong>\n\n                    </ion-col>\n\n                    <ion-col>\n\n                        <button ion-button id="sub-btn" (click)="decrCounter( item )">\n\n                            <ion-icon name="md-remove-circle"></ion-icon>\n\n                        </button>\n\n                    </ion-col>\n\n                </ion-row>\n\n            </ion-grid>\n\n        </ion-card-content>\n\n    </ion-card>\n\n</ion-content>\n\n`/*ion-inline-end:"C:\Users\hayde\Desktop\wholesomesweetsclient\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__globals__["a" /* Globals */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ })

},[201]);
//# sourceMappingURL=main.js.map