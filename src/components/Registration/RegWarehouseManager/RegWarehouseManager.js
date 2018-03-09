import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './RegWarehouseManager.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Constants from '../../config';

export default class RegWarehouseManager extends Component {
    isValidLogin = false;
    isValidPassword = false;
    constructor(props) {
        super(props);
        this.state = {
            fio: "",
            login: "",
            password: "",
            repeatPassword: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginInput = this.handleLoginInput.bind(this);
        this.handleFIOInput = this.handleFIOInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleRepeatPasswordInput = this.handleRepeatPasswordInput.bind(this);
        this.validateLogin = this.validateLogin.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateFIO = this.validateFIO.bind(this);
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
        this.validateFIO();
        this.validateLogin();
        this.validatePassword();
        if (!this.isValidLogin || !this.isValidPassword) {
            return;
        }
        $.ajax({
            url: '/regWarehouseManager/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                fio: this.state.fio,
                login: this.state.login,
                password: this.state.password,
                role: 'Менеджер склада'
            },
            success: function (dataFromServer) {
                if (dataFromServer['ErrorInfo'] === undefined) {
                    return;
                }
                RegWarehouseManager.errorInfo('loginInfo', dataFromServer['ErrorInfo'], 'inputLogin');
            }
        });
    }

    handleFIOInput(event) {
        this.setState({
            fio: event.target.value
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

    handleRepeatPasswordInput(event) {
        this.setState({
            repeatPassword: event.target.value
        });
    }

    validateFIO() {
        if (this.state.fio.length === 0) {
            RegWarehouseManager.errorInfo('fioInfo', 'Не введено ФИО', 'inputFIO');
        }
    }

    validateLogin() {
        if (this.state.login.length === 0) {
            RegWarehouseManager.errorInfo('loginInfo', 'Не введён логин', 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.length > Constants.maxLoginLength) {
            RegWarehouseManager.errorInfo('loginInfo',
                `Максимальная длина логина ${Constants.maxLoginLength} символов`, 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.length < Constants.minLoginLength) {
            RegWarehouseManager.errorInfo('loginInfo',
                `Минимальная длина логина ${Constants.minLoginLength} символов`, 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.match(Constants.loginRegexp) != this.state.login) {
            RegWarehouseManager.errorInfo('loginInfo', 'Некорректный логин', 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        this.isValidLogin = true;
    }

    validatePassword() {
        if (this.state.password.length === 0) {
            RegWarehouseManager.errorInfo('passwordInfo', 'Не введён пароль', 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.length > Constants.maxPassLength) {
            RegWarehouseManager.errorInfo('passwordInfo',
                `Максимальная длина пароля ${Constants.maxPassLength} символов`, 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.length < Constants.minPassLength) {
            RegWarehouseManager.errorInfo('passwordInfo',
                `Минимальная длина пароля ${Constants.minPassLength} символов`, 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.match(Constants.passRegexp) != this.state.password) {
            RegWarehouseManager.errorInfo('passwordInfo', 'Некорректный пароль', 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.repeatPassword !== this.state.password) {
            RegWarehouseManager.errorInfo('passwordInfo', 'Пароли не совпадают', 'inputPassword',
                'repeatPasswordInfo', 'repeatInputPassword');
            this.isValidPassword = false;
            return;
        }
        this.isValidPassword = true;
    }

    render() {
        return (
            <div className="container center-block">

                <div id="inscriptionRegManager">Регистрация менеджера склада</div>

                <form id='regForm' onSubmit={this.handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="inputFIO">
                            ФИО:
                        </label>
                        <input type="text" onChange={this.handleFIOInput} className="form-control"
                               id="inputFIO" placeholder="Введите ФИО"/>
                        <p id="fioInfo" className="errorInfo"/>
                    </div>

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