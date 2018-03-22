import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Home extends Component {
    render() {
        return (
            <div className="container screen-height-container">
                <div className="btn-group-vertical center-block roles" role="group" aria-label="...">
                    <div id="inscription">Вход</div>
                    <Link role="button" className="btn btn-primary btn-block role" to='/login/warehouseManager/'>
                        Менеджер склада
                    </Link>
                    <Link role="button" className="btn btn-primary btn-block role" to='/supplier/'>
                        Поставщик сырья
                    </Link>
                    <Link role="button" className="btn btn-primary btn-block role" to='/supplier/'>
                        Поставщик сырья
                    </Link>
                    <Link role="button" className="btn btn-primary btn-block role" to='/supplier/'>
                        Поставщик сырья
                    </Link>
                    <Link role="button" className="btn btn-primary btn-block role" to='/supplier/'>
                        Поставщик сырья
                    </Link>
                    <Link id="reg" className="btn btn-link btn-block" to='/registration/'>
                        Регистрация
                    </Link>
                </div>
            </div>
        )
    }
}