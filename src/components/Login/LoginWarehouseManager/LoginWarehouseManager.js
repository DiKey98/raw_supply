import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './LoginWarehouseManager.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Constants from '../../config';
import Utils from '../../Utils';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';

let cookies = new Cookies();

export default class LoginWarehouseManager extends Component {
    isValidLogin = false;
    isValidPassword = false;
    redirect = false;

    constructor(props) {
        super(props);
        this.state = {
            login: "",
            password: "",
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

    handleSubmit(event) {
        event.preventDefault();
        this.isValidLogin = Utils.validateLogin(this.state.login, 'loginInfo', 'inputLogin');
        this.isValidPassword = Utils.validatePassword(this.state.password, 'passwordInfo', 'inputPassword');
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
                role: Constants.warehouseManagerRole,
                sessionName: Constants.warehouseManagerSession,
            },
            success: function (dataFromServer) {
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
                    return
                }
                this.redirect = true;
                this.forceUpdate();
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

    render() {
        if (this.redirect) {
            return (
                <Redirect to='/main/warehouseManager/'/>
            )
        }
        if (cookies.get(Constants.warehouseManagerSession) !== undefined) {
            return (
                <Redirect to='/main/warehouseManager/'/>
            )
        }
        return (
            <div className="container center-block">

                <div id="inscriptionRegManager">Вход для менеджера склада</div>

                <form id='regWarehouseManagerForm' onSubmit={this.handleSubmit}>

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