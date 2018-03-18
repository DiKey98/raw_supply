import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Constants from '../../../config';
import { Redirect } from 'react-router';
import Utils from '../../../Utils';
import './AddSupplier.css'
import WarehouseManagerMainMenu from "../WarehouseManagerMainMenu/WarehouseManagerMainMenu";

export default class AddSupplier extends Component {
    isValidName = false;
    isValidPhone = false;
    isValidLegalAddress = false;
    isValidMailingAddress = false;
    isValidINN = false;
    isValidBankDetails = false;
    isValidGeneralManager = false;
    isValidGeneralAccountant = false;

    constructor(props) {
        super(props);
        this.state = {
            fio: "",
            login: "",
            password: "",
            repeatPassword: "",
            redirect: false
        };
        /*this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLoginInput = this.handleLoginInput.bind(this);
        this.handleFIOInput = this.handleFIOInput.bind(this);
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleRepeatPasswordInput = this.handleRepeatPasswordInput.bind(this);*/
    }

    /*componentDidMount() {
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
        this.isValidFio = Utils.validateFIO(this.state.fio, 'fioInfo', 'inputFIO');
        this.isValidLogin = Utils.validateLogin(this.state.login, 'loginInfo', 'inputLogin');
        this.isValidPassword = Utils.validatePassword(this.state.password, 'passwordInfo', 'inputPassword',
            this.state.repeatPassword, 'repeatPasswordInfo', 'repeatInputPassword');
        alert(this.isValidFio + this.isValidLogin + this.isValidPassword);
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
    }*/

    render() {
        if (this.state.redirect) {
            return <Redirect to='/regInfoPage/'/>;
        }
        return (
            <div>
                <WarehouseManagerMainMenu/>
                <div className="container center-block">

                    <form id='addSupplierForm'>

                        <div className="form-group">
                            <label htmlFor="inputFIO">
                                Название организации:
                            </label>
                            <input type="text"  className="form-control"
                                   id="inputFIO" placeholder="Введите ФИО"/>
                            <p id="fioInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputLogin">
                                Телефон:
                            </label>
                            <input type="text"  className="form-control"
                                   id="inputLogin" placeholder="Введите логин"/>
                            <p id="loginInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputPassword">
                                Юридический адрес:
                            </label>
                            <input type="password"  className="form-control"
                                   id="inputPassword" placeholder="Введите пароль"/>
                            <p id="passwordInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputEmail">
                                Почтовый адрес:
                            </label>
                            <input type="password"  className="form-control"
                                   id="repeatInputPassword" placeholder="Повторите пароль"/>
                            <p id="repeatPasswordInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputEmail">
                                ИНН:
                            </label>
                            <input type="password"  className="form-control"
                                   id="repeatInputPassword" placeholder="Повторите пароль"/>
                            <p id="repeatPasswordInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputEmail">
                                Банковские реквизиты:
                            </label>
                            <input type="password"  className="form-control"
                                   id="repeatInputPassword" placeholder="Повторите пароль"/>
                            <p id="repeatPasswordInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputEmail">
                                Генеральный директор:
                            </label>
                            <input type="password"  className="form-control"
                                   id="repeatInputPassword" placeholder="Повторите пароль"/>
                            <p id="repeatPasswordInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputEmail">
                                Главный бухгалтер:
                            </label>
                            <input type="password"  className="form-control"
                                   id="repeatInputPassword" placeholder="Повторите пароль"/>
                            <p id="repeatPasswordInfo" className="errorInfo"/>
                        </div>

                        <button id="regButton" type="submit" className="btn btn-default">
                            Добавить
                        </button>

                    </form>

                    <div id="toMainFromRegBlock" className="btn-group-vertical center-block" role="group" aria-label="...">
                        <Link id="toMainFromReg" className="btn btn-link" to='/'>
                            На главную
                        </Link>
                    </div>

                </div>
            </div>
        )
    }
}