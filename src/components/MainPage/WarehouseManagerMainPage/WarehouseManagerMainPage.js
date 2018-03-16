import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom';
import Constants from '../../config';
import Utils from '../../Utils';

let cookies = new Cookies();

export default class WarehouseManagerMainPage extends Component {
    render() {
        if (cookies.get(Constants.warehouseManagerSession) === undefined) {
            return (
                <Redirect to='/login/warehouseManager/'/>
            )
        }
        return (
            <div>
                Главная для менеджера склада
            </div>
        )
    }
}