import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import './AdminMenu.css'

export default class AdminMenu extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div id="adminMenu">
                <div className="btn-group-vertical" role="group" aria-label="...">
                    <Link role="button" className="btn btn-default btn-block adminMenuButtons"
                          to='/admin/page/UnverifiedUsers/'>
                        Неподтвержденные пользователи
                    </Link>
                    <Link role="button" className="btn btn-default btn-block adminMenuButtons"
                          to='/admin/page/addAdmin/'>
                        Добавить администратора
                    </Link>
                    <Link role="button" className="btn btn-default btn-block adminMenuButtons" to='/'>
                        На главную
                    </Link>
                    <Link id="exitAdminButton" role="button"
                          className="btn btn-default btn-block adminMenuButtons" to=''>
                        Выход
                    </Link>
                </div>
            </div>
        )
    }
}