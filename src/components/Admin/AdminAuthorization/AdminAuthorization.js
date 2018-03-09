import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './AdminAuthorization.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom';

export default class AdminAuthorization extends React.Component {
    cookies = new Cookies();
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginInput = this.handleLoginInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        AdminAuthorization.errorInfo = AdminAuthorization.errorInfo.bind(this);
    }

    static errorInfo(idInfoElement, text) {
        $(`#${idInfoElement}`).text(text).css({
            visibility: 'visible'
        });
        if (arguments.length < 3) {
            return;
        }
        $(`#${arguments[2]}`).css({
            borderWidth: '3px',
            borderColor: 'red'
        });
        if (arguments.length < 4) {
            return;
        }
        $(`#${arguments[3]}`).text(text).css({
            visibility: 'visible',
        });
        if (arguments.length < 5) {
            return;
        }
        $(`#${arguments[4]}`).text(text).css({
            borderWidth: '3px',
            borderColor: 'red'
        });
    }


    handleLoginInput(event) {
        this.setState({
            login: event.target.value
        });
    }

    handlePasswordInput(event) {
        this.setState({
            password: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        $.ajax({
            url: '/loginAdmin/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                login: this.state.login,
                password: this.state.password
            },
            success: function (dataFromServer) {
                if (dataFromServer['ErrorLogin'] !== undefined) {
                    AdminAuthorization.errorInfo('loginAdminInfo',
                        dataFromServer['ErrorLogin'], 'inputAdminLogin');
                }
                if (dataFromServer['ErrorPassword'] !== undefined) {
                    AdminAuthorization.errorInfo('passwordAdminInfo',
                        dataFromServer['ErrorPassword'], 'inputAdminPassword');
                }
                if (dataFromServer['adminAuthenticated']) {
                    this.cookies.set('adminAuthenticated', true, { path: '/' });
                    this.forceUpdate();
                }
            }.bind(this)
        });
    }

    render() {
        if (this.cookies.get('adminAuthenticated')) {
            return (
                <Redirect to='/admin/page/'/>
            )
        }
        return (
            <div className="container center-block">

                <div id="inscriptionLoginAdmin">Вход на страницу администратора</div>

                <form id='adminLoginForm' onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="inputAdminLogin">
                            Логин:
                        </label>
                        <input type="text" onChange={this.handleLoginInput} className="form-control"
                               id="inputAdminLogin" placeholder="Введите логин"/>
                        <p id="loginAdminInfo" className="errorInfo"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="inputAdminPassword">
                            Пароль:
                        </label>
                        <input type="password" onChange={this.handlePasswordInput} className="form-control"
                               id="inputAdminPassword" placeholder="Введите пароль"/>
                        <p id="passwordAdminInfo" className="errorInfo"/>
                    </div>

                    <button id="adminLoginButton" type="submit" className="btn btn-default">
                        Войти
                    </button>

                </form>

                <div id="toMainFromAdminLoginBlock" className="btn-group-vertical center-block" role="group" aria-label="...">
                    <Link id="toMainFromAdminLogin" className="btn btn-link" to='/'>
                        На главную
                    </Link>
                </div>

            </div>

        )
    }
}