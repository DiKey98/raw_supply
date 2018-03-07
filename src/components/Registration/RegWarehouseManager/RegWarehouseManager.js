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
        RegWarehouseManager.errorInfo = RegWarehouseManager.errorInfo.bind(this);
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
        if (this.state.login.length === 0) {
            RegWarehouseManager.errorInfo('loginInfo', 'Не введён логин', 'inputLogin');
            return;
        }
        if (this.state.login.length < 10) {
            RegWarehouseManager.errorInfo('loginInfo', 'Неверный логин', 'inputLogin');
        }
    }

    validatePassword() {
        if (this.state.password.length === 0) {
            RegWarehouseManager.errorInfo('passwordInfo', 'Не введён пароль', 'inputPassword');
            return;
        }
        if (this.state.repeatPassword !== this.state.password) {
            RegWarehouseManager.errorInfo('passwordInfo', 'Пароли не совпадают', 'inputPassword',
                'repeatPasswordInfo', 'repeatInputPassword');
            return;
        }
        if (this.state.password.length < 10) {
            RegWarehouseManager.errorInfo('passwordInfo', 'Неверный пароль', 'inputPassword');
        }
    }

    render() {
        return (
            <div className="container center-block">

                <div id="inscriptionRegManager">Регистрация менеджера склада</div>

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

                    <div className="form-group">
                        <label htmlFor="inputEmail">
                            Повтор пароля:
                        </label>
                        <input type="password" onChange={this.handleRepeatPasswordInput} className="form-control"
                               id="repeatInputPassword" placeholder="Повторите пароль"/>
                        <p id="repeatPasswordInfo" className="errorInfo"/>
                    </div>

                    <button id="regButton" type="submit" className="btn btn-default">
                        Регистрация
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