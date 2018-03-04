import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './RegWarehouseManager.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

export default class RegWarehouseManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
            repeatPassword: "",
            isValidLogin: true,
            isValidPassword: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginInput = this.handleLoginInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleRepeatPasswordInput = this.handleRepeatPasswordInput.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.validateLogin();
        this.validatePassword();

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

    handleRepeatPasswordInput(event) {
        this.setState({
            repeatPassword: event.target.value
        });
    }

    validateLogin() {
        if (this.state.login.length < 10) {
            $('#loginInfo').text('Неверный логин').css({
                visibility: 'visible'
            })
        }
    }

    validatePassword() {
        if (this.state.password.length < 10) {
            $('#passwordInfo').text('Неверный пароль').css({
                visibility: 'visible',
                marginBottom: '30px !important'
            })
        }
        if (this.state.repeatPassword !==  this.state.password) {
            $('#repeatPasswordInfo').text('Пароли не совпадают').css({
                visibility: 'visible',
                marginBottom: '30px !important'
            });
            $('#passwordInfo').text('Пароли не совпадают').css({
                visibility: 'visible',
                marginBottom: '30px !important'
            })
        }
    }

    render() {
        return (
            <div className="container">

                <div id="inscriptionRegManager">Регистрация менеджера склада</div>

                <form id='regForm' onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="inputLogin">
                            Логин:
                        </label>
                        <input type="text" onChange={this.handleLoginInput} className="form-control"
                               id="inputLogin" placeholder="Введите логин"/>
                        <p id="loginInfo"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="inputPassword">
                            Пароль:
                        </label>
                        <input type="password" onChange={this.handlePasswordInput} className="form-control"
                               id="inputPassword" placeholder="Введите пароль"/>
                        <p id="passwordInfo"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="inputEmail">
                            Повтор пароля:
                        </label>
                        <input type="password" onChange={this.handleRepeatPasswordInput} className="form-control"
                               id="repeatInputPassword" placeholder="Повторите пароль"/>
                        <p id="repeatPasswordInfo"/>
                    </div>

                    <button id="regButton" type="submit" className="btn btn-default">
                        Регистрация
                    </button>

                </form>

                <div className="btn-group-vertical center-block" role="group" aria-label="...">
                    <Link id="toMain" className="btn btn-link btn-block" to='/'>
                        На главную
                    </Link>
                </div>

            </div>
        )
    }
}