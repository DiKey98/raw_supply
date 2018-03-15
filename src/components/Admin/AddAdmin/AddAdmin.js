import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom';
import Constants from '../../config';
import AdminMenu from "../AdminMenu/AdminMenu";

let cookies = new Cookies();

export default class AddAdmin extends Component {
    redirect = false;
    isValidLogin = false;
    isValidPassword = false;

    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
            repeatPassword: "",
            redirect: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginInput = this.handleLoginInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRepeatPasswordInput = this.handleRepeatPasswordInput.bind(this);
        AddAdmin.errorInfo = AddAdmin.errorInfo.bind(this);
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

    handleSubmit(event) {
        event.preventDefault();
        this.validateLogin();
        this.validatePassword();
        if (!this.isValidLogin || !this.isValidPassword) {
            return;
        }
        $.ajax({
            url: '/addAdmin/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                login: this.state.login,
                password: this.state.password,
                role: Constants.adminRole,
            },
            success: function (dataFromServer) {
                if (dataFromServer['ErrorInfo'] === "") {
                    this.setState({
                        login: "",
                        password: "",
                        repeatPassword: "",
                    });
                    this.isValidLogin = false;
                    this.isValidPassword = false;
                    return;
                }
                AddAdmin.errorInfo('loginInfo', dataFromServer['ErrorInfo'], 'inputLogin');
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

    handleRepeatPasswordInput(event) {
        this.setState({
            repeatPassword: event.target.value
        });
    }

    validateLogin() {
        if (this.state.login.length === 0) {
            AddAdmin.errorInfo('loginInfo', 'Не введён логин', 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.length > Constants.maxLoginLength) {
            AddAdmin.errorInfo('loginInfo',
                `Максимальная длина логина ${Constants.maxLoginLength} символов`, 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.length < Constants.minLoginLength) {
            AddAdmin.errorInfo('loginInfo',
                `Минимальная длина логина ${Constants.minLoginLength} символов`, 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        if (this.state.login.match(Constants.loginRegexp) != this.state.login) {
            AddAdmin.errorInfo('loginInfo', 'Некорректный логин', 'inputLogin');
            this.isValidLogin = false;
            return;
        }
        this.isValidLogin = true;
    }

    validatePassword() {
        if (this.state.password.length === 0) {
            AddAdmin.errorInfo('passwordInfo', 'Не введён пароль', 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.length > Constants.maxPassLength) {
            AddAdmin.errorInfo('passwordInfo',
                `Максимальная длина пароля ${Constants.maxPassLength} символов`, 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.length < Constants.minPassLength) {
            AddAdmin.errorInfo('passwordInfo',
                `Минимальная длина пароля ${Constants.minPassLength} символов`, 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.password.match(Constants.passRegexp) != this.state.password) {
            AddAdmin.errorInfo('passwordInfo', 'Некорректный пароль', 'inputPassword');
            this.isValidPassword = false;
            return;
        }
        if (this.state.repeatPassword !== this.state.password) {
            AddAdmin.errorInfo('passwordAdminInfo', 'Пароли не совпадают', 'inputAdminPassword',
                'repeatPasswordAdminInfo', 'repeatInputAdminPassword');
            this.isValidPassword = false;
            return;
        }
        this.isValidPassword = true;
    }

    render() {
        if (cookies.get(Constants.adminSession) === undefined) {
            return (
                <Redirect to='/admin/authorization/'/>
            )
        }
        return (
            <div>
                <AdminMenu/>

                <div className="container center-block">

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

                        <div className="form-group">
                            <label htmlFor="inputEmail">
                                Повтор пароля:
                            </label>
                            <input type="password" onChange={this.handleRepeatPasswordInput} className="form-control"
                                   id="repeatInputAdminPassword" placeholder="Повторите пароль"/>
                            <p id="repeatPasswordAdminInfo" className="errorInfo"/>
                        </div>

                        <button id="adminLoginButton" type="submit" className="btn btn-default">
                            Добавить
                        </button>

                    </form>

                </div>
            </div>

        )
    }
}