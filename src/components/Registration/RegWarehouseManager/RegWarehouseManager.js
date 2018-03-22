import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './RegWarehouseManager.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Constants from '../../config';
import { Redirect } from 'react-router';
import Utils from '../../Utils';

export default class RegWarehouseManager extends Component {
    isValidLogin = false;
    isValidPassword = false;
    isValidFio = false;

    constructor(props) {
        super(props);
        this.state = {
            fio: "",
            login: "",
            password: "",
            repeatPassword: "",
            redirect: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginInput = this.handleLoginInput.bind(this);
        this.handleFIOInput = this.handleFIOInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleRepeatPasswordInput = this.handleRepeatPasswordInput.bind(this);
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
        this.isValidFio = Utils.validateFIO(this.state.fio, 'fioInfo', 'inputFIO');
        this.isValidLogin = Utils.validateLogin(this.state.login, 'loginInfo', 'inputLogin');
        this.isValidPassword = Utils.validatePassword(this.state.password, 'passwordInfo', 'inputPassword',
            this.state.repeatPassword, 'repeatPasswordInfo', 'repeatInputPassword');

        if (!this.isValidLogin || !this.isValidPassword || !this.isValidFio) {
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
                role: Constants.warehouseManagerRole,
            },
            success: function (dataFromServer) {
                if (dataFromServer['ErrorInfo'] === "") {
                    this.setState({
                        redirect: true,
                    });
                    return;
                }
                Utils.errorInfo('loginInfo', dataFromServer['ErrorInfo'], 'inputLogin');
            }.bind(this)
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

    render() {
        if (this.state.redirect) {
            return <Redirect to='/regInfoPage/'/>;
        }
        return (
            <div className="container screen-height-container center-block">

                <div id="inscriptionRegManager">Регистрация менеджера склада</div>

                <form id='regWarehouseManagerForm' onSubmit={this.handleSubmit}>

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