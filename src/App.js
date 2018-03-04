import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import Home from './components/Home/Home';
import AddSupplier from './components/AddSupplier/AddSupplier';
import RegistrationMain from './components/Registration/RegistrationMain';
import RegWarehouseManager from './components/Registration/RegWarehouseManager/RegWarehouseManager';

export default class App extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact={true} path='/' component={Home}/>
                    <Route exact={true} path='/addSupplier/' component={AddSupplier}/>
                    <Route exact={true} path='/registration/' component={RegistrationMain}/>
                    <Route exact={true} path='/registration/warehouseManager/' component={RegWarehouseManager}/>
                    <Route exact={true} path='/registration/supplier/' component={RegistrationMain}/>
                </Switch>
            </div>
        );
    }
}