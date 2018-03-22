import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './RegistrationMain.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RegistrationMain extends Component {
    render() {
        return (
            <div className="container screen-height-container">
                <div className="btn-group-vertical center-block roles" role="group" aria-label="...">
                    <div id="inscription">Регистрация</div>
                    <Link role="button" className="btn btn-primary btn-block role" to='/registration/warehouseManager/'>
                        Менеджер склада
                    </Link>
                    <Link role="button" className="btn btn-primary btn-block role" to='/registration/supplier/'>
                        Поставщик сырья
                    </Link>
                    <Link role="button" className="btn btn-primary btn-block role" to='/registration/supplier/'>
                        Поставщик сырья
                    </Link>
                    <Link role="button" className="btn btn-primary btn-block role" to='/registration/supplier/'>
                        Поставщик сырья
                    </Link>
                    <Link role="button" className="btn btn-primary btn-block role" to='/registration/supplier/'>
                        Поставщик сырья
                    </Link>
                    <Link id="toMain" className="btn btn-link btn-block" to='/'>
                        На главную
                    </Link>
                </div>
            </div>
        )
    }
}