import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegInfoPage.css'
import $ from 'jquery';

export default class RegInfoPage extends Component {
    render() {
        return (
            <div className="container regInfoContainer center-block">
                <div id="regInfo" className="center-block">
                    <p>Ваша учетная запись находится в разделе "Не подтвержденные пользователи".</p><br/>
                    <p>В течение часа администратор ресурса проверит ее.</p><br/>
                    <p>Пока Вы можете вернуться на <Link to="/">главную страницу</Link></p><br/>
                </div>
            </div>
        )
    }
}
