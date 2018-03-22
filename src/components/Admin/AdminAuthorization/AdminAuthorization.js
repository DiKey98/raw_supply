import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './AdminAuthorization.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom';
import Constants from '../../config';
import Utils from '../../Utils';

let cookies = new Cookies();

export default class AdminAuthorization extends Component {
    redirect = false;

    isValidLogin = false;
    isValidPassword = false;

    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
            redirect: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginInput = this.handleLoginInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
    }

    componentDidMount() {
        $('input').focusin(function () {
            $(this).select();
        }).click(function () {
            $('.errorInfo').html("");
            $('input').css({
                borderWidth: '0px',
            })
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
        this.isValidLogin = Utils.validateLogin(this.state.login, 'loginAdminInfo', 'inputAdminLogin');
        this.isValidPassword = Utils.validatePassword(this.state.password, 'passwordAdminInfo', 'inputAdminPassword');
        if (!this.isValidLogin || !this.isValidPassword) {
            return;
        }
        $.ajax({
            url: '/loginAdmin/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                login: this.state.login,
                password: this.state.password,
                role: Constants.adminRole,
                sessionName: Constants.adminSession,
            },
            success: function (dataFromServer) {
                if (dataFromServer['ErrorLogin'] !== "") {
                    AdminAuthorization.errorInfo('loginAdminInfo',
                        dataFromServer['ErrorLogin'], 'inputAdminLogin');
                    return;
                }
                if (dataFromServer['ErrorPassword'] !== "") {
                    AdminAuthorization.errorInfo('passwordAdminInfo',
                        dataFromServer['ErrorPassword'], 'inputAdminPassword');
                    return;
                }
                if (dataFromServer['ErrorRole'] !== "") {
                    AdminAuthorization.errorInfo('loginAdminInfo',
                        dataFromServer['ErrorRole'], 'inputAdminLogin');
                }
                this.redirect = true;
                this.forceUpdate();
            }.bind(this)
        });
    }

    render() {
        if (this.redirect) {
            return (
                <Redirect to='/admin/page/'/>
            )
        }
        if (cookies.get(Constants.adminSession) !== undefined) {
            return (
                <Redirect to='/admin/page/'/>
            )
        }
        return (
            <div className="container screen-height-container center-block">

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