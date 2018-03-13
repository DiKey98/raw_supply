import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './LoginWarehouseManager.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Constants from '../../config';
import { Redirect } from 'react-router';

export default class LoginWarehouseManager extends Component {
    isValidLogin = false;
    isValidPassword = false;
    redirect = true;
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginInput = this.handleLoginInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        LoginWarehouseManager.errorInfo = LoginWarehouseManager.errorInfo.bind(this);
    }

    componentDidMount() {
        $('input').focusin(function () {
            $(this).select();
        }).click(function () {
            $('.errorInfo').css({
                    visibility: 'hidden'
                }
            );
            $('input').css({
                borderWidth: '0px',
            })
        });
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

    handleSubmit(event) {
        event.preventDefault();
        this.validateLogin();
        this.validatePassword();
        if (!this.isValidLogin || !this.isValidPassword) {
            return;
        }
        $.ajax({
            url: '/loginWarehouseManager/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                login: this.state.login,
                password: this.state.password,
                role: "Менеджер склада"
            },
            success: function (dataFromServer) {
                if (dataFromServer['ErrorInfo'] === "") {
                    this.setState({
                        redirect: true,
                    });
                    return;
                }
                if (dataFromServer['ErrorLogin'] !== "") {
                    LoginWarehouseManager.errorInfo('loginInfo', dataFromServer['ErrorLogin'], 'inputLogin');
                    return;
                }
                if (dataFromServer['ErrorPassword'] !== "") {
                    LoginWarehouseManager.errorInfo('passwordInfo', dataFromServer['ErrorPassword'], 'inputPassword');
                    return;
                }
                if (dataFromServer['ErrorRole'] !== "") {
                    LoginWarehouseManager.errorInfo('loginInfo', dataFromServer['ErrorRole'], 'inputLogin');
                }
            }.bind(this)
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

    validateLogin() {
        if (this.state.login.length === 0) {
            LoginWarehouseManager.errorInfo('loginInfo', 'Не введён логин', 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.length > Constants.maxLoginLength) {
            LoginWarehouseManager.errorInfo('loginInfo',
                `Максимальная длина логина ${Constants.maxLoginLength} символов`, 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.length < Constants.minLoginLength) {
            LoginWarehouseManager.errorInfo('loginInfo',
                `Минимальная длина логина ${Constants.minLoginLength} символов`, 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.match(Constants.loginRegexp) != this.state.login) {
            LoginWarehouseManager.errorInfo('loginInfo', 'Некорректный логин', 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        this.isValidLogin = true;
    }

    validatePassword() {
        if (this.state.password.length === 0) {
            LoginWarehouseManager.errorInfo('passwordInfo', 'Не введён пароль', 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.length > Constants.maxPassLength) {
            LoginWarehouseManager.errorInfo('passwordInfo',
                `Максимальная длина пароля ${Constants.maxPassLength} символов`, 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.length < Constants.minPassLength) {
            LoginWarehouseManager.errorInfo('passwordInfo',
                `Минимальная длина пароля ${Constants.minPassLength} символов`, 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.match(Constants.passRegexp) != this.state.password) {
            LoginWarehouseManager.errorInfo('passwordInfo', 'Некорректный пароль', 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        this.isValidPassword = true;
    }

    render() {
        return (
            <div className="container center-block">

                <div id="inscriptionRegManager">Вход для менеджера склада</div>

                <form id='regForm' onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="inputLogin">
                            Логин:
                        </label>
                        <input type="text" onChange={this.handleLoginInput} className="form-control"
                               id="inputLogin" placeholder="Введите логин"/>
                        <p id="loginInfo" className="errorInfo"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="inputPassword">
                            Пароль:
                        </label>
                        <input type="password" onChange={this.handlePasswordInput} className="form-control"
                               id="inputPassword" placeholder="Введите пароль"/>
                        <p id="passwordInfo" className="errorInfo"/>
                    </div>

                    <button id="regButton" type="submit" className="btn btn-default">
                        Войти
                    </button>

                </form>

                <div id="toMainFromRegBlock" className="btn-group-vertical center-block" role="group" aria-label="...">
                    <Link id="toMainFromReg" className="btn btn-link" to='/'>
                        На главную
                    </Link>
                </div>

            </div>

        )
    }
}