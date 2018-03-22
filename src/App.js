import React, {Component} from 'react';
import {Route, Switch} from 'react-router';
import Home from './components/Home/Home';
import AddSupplier from './components/MainPage/WarehouseManagerMainPage/AddSupplier/AddSupplier';
import RegistrationMain from './components/Registration/RegistrationMain';
import RegWarehouseManager from './components/Registration/RegWarehouseManager/RegWarehouseManager';
import AdminPage from './components/Admin/AdminPage/AdminPage';
import AdminAuthorization from './components/Admin/AdminAuthorization/AdminAuthorization';
import RegInfoPage from './components/RegInfoPage/RegInfoPage';
import LoginWarehouseManager from './components/Login/LoginWarehouseManager/LoginWarehouseManager';
import UnverifiedUsers from './components/Admin/UnverifiedUsers/UnverifiedUsers';
import AddAdmin from "./components/Admin/AddAdmin/AddAdmin";
import WarehouseManagerMainPage from './components/MainPage/WarehouseManagerMainPage/WarehouseManagerMainPage';
import RawIncoming from './components/MainPage/WarehouseManagerMainPage/Raw/RawIncoming/RawIncoming';

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

                    <Route exact={true} path='/admin/page/' component={AdminPage}/>
                    <Route exact={true} path='/admin/authorization/' component={AdminAuthorization}/>
                    <Route exact={true} path='/admin/page/UnverifiedUsers/' component={UnverifiedUsers}/>
                    <Route exact={true} path='/admin/page/addAdmin/' component={AddAdmin}/>

                    <Route exact={true} path='/regInfoPage/' component={RegInfoPage}/>

                    <Route exact={true} path='/login/warehouseManager/' component={LoginWarehouseManager}/>

                    <Route exact={true} path='/main/warehouseManager/' component={WarehouseManagerMainPage}/>
                    <Route exact={true} path='/main/warehouseManager/suppliers/add/'
                           component={AddSupplier}/>
                    <Route exact={true} path='/main/warehouseManager/raw/incoming/'
                           component={RawIncoming}/>

                </Switch>
            </div>
        );
    }
}