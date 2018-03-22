import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom';
import Constants from '../../config';
import AdminMenu from '../AdminMenu/AdminMenu';
import Utils from '../../Utils';

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
        this.handleLoginInput = this.handleLoginInput.bind(this);
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
        this.isValidLogin = Utils.validateLogin(this.state.login, 'loginAdminInfo', 'inputAdminLogin');
        this.isValidPassword = Utils.validatePassword(this.state.password, 'passwordAdminInfo', 'inputAdminPassword',
            this.state.repeatPassword, 'repeatPasswordAdminInfo', 'repeatInputAdminPassword');
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
                    $('#adminLoginForm').trigger('reset');
                    return;
                }
                Utils.errorInfo('loginAdminInfo', dataFromServer['ErrorInfo'], 'inputAdminLogin');
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

    render() {
        if (cookies.get(Constants.adminSession) === undefined) {
            return (
                <Redirect to='/admin/authorization/'/>
            )
        }
        return (
            <div>
                <AdminMenu/>

                <div className="container screen-height-container center-block">

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