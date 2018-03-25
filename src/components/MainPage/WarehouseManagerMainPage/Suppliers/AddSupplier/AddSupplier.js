import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Constants from '../../../../config';
import { Redirect } from 'react-router';
import Utils from '../../../../Utils';
import './AddSupplier.css'
import WarehouseManagerMainMenu from "../../WarehouseManagerMainMenu/WarehouseManagerMainMenu";
import Cookies from 'universal-cookie';

let cookies = new Cookies();

export default class AddSupplier extends Component {
    isValidOrg = false;
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
            org: "",
            phone: "",
            legalAddress: "",
            mailingAddress: "",
            inn: "",
            bankDetails: "",
            generalManager: "",
            generalAccountant: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateSupplier = this.validateSupplier.bind(this);
        this.handleOrgInput = this.handleOrgInput.bind(this);
        this.handlePhoneInput = this.handlePhoneInput.bind(this);
        this.handleLegalAddressInput = this.handleLegalAddressInput.bind(this);
        this.handleMailingAddressInput = this.handleMailingAddressInput.bind(this);
        this.handleINNInput = this.handleINNInput.bind(this);
        this.handleBankDetailsInput = this.handleBankDetailsInput.bind(this);
        this.handleGeneralManagerInput = this.handleGeneralManagerInput.bind(this);
        this.handleGeneralAccountantInput = this.handleGeneralAccountantInput.bind(this);
    }

    componentDidMount() {
        $('input, textarea').focusin(function () {
            $(this).select();
        }).click(function () {
            $('.errorInfo').html("");
            $('input, textarea').css({
                borderWidth: '0px',
            });
            this.forceUpdate();
        }.bind(this));
    }

    validateSupplier() {
        if (this.state.org.length === 0) {
            Utils.errorInfo('orgInfo', "Не введено название организации", 'inputOrg');
            this.isValidOrg = false;
        } else {
            this.isValidOrg = true;
        }

        if (this.state.phone.length === 0) {
            Utils.errorInfo('phoneInfo', "Не введен контактный телефон", 'inputPhone');
            this.isValidPhone = false;
        } else {
            this.isValidPhone = true;
        }

        if (this.state.legalAddress.length === 0) {
            Utils.errorInfo('legalAddressInfo', "Не введен юридический адрес", 'inputLegalAddress');
            this.isValidLegalAddress = false;
        } else {
            this.isValidLegalAddress = true;
        }

        if (this.state.mailingAddress.length === 0) {
            Utils.errorInfo('mailingAddressInfo', "Не введен почтовый адрес", 'inputMailingAddress');
            this.isValidMailingAddress = false;
        } else {
            this.isValidMailingAddress = true;
        }

        if (this.state.inn.length === 0) {
            Utils.errorInfo('innInfo', "Не введен ИНН", 'inputINN');
            this.isValidINN = false;
        } else {
            this.isValidINN = true;
        }

        if (this.state.bankDetails.length === 0) {
            Utils.errorInfo('bankDetailsInfo', "Не введены банковские реквизиты", 'inputBankDetails');
            this.isValidBankDetails = false;
        } else {
            this.isValidBankDetails = true;
        }

        if (this.state.generalManager.length === 0) {
            Utils.errorInfo('generalManagerInfo', "Не введено ФИО ген. директора", 'inputGeneralManager');
            this.isValidGeneralManager = false;
        } else {
            this.isValidGeneralManager = true;
        }

        if (this.state.generalAccountant.length === 0) {
            Utils.errorInfo('generalAccountantInfo', "Не введено ФИО гл. бухгалтера", 'inputGeneralAccountant');
            this.isValidGeneralAccountant = false;
        } else {
            this.isValidGeneralAccountant = true;
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.validateSupplier();

        if (!this.isValidOrg || !this.isValidPhone || !this.isValidLegalAddress ||
            !this.isValidMailingAddress || !this.isValidINN || !this.isValidGeneralManager ||
            !this.isValidGeneralAccountant || !this.isValidBankDetails) {
            return;
        }

        $.ajax({
            url: '/addSupplier/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                org: this.state.org,
                phone: this.state.phone,
                legalAddress: this.state.legalAddress,
                mailingAddress: this.state.mailingAddress,
                inn: this.state.inn,
                bankDetails: this.state.bankDetails,
                generalManager: this.state.generalManager,
                generalAccountant: this.state.generalAccountant,
            },
            success: function (dataFromServer) {
                if (dataFromServer['ErrorInfo'] !== "") {
                    Utils.errorInfo('innInfo', dataFromServer['ErrorInfo'], 'inputINN');
                    return;
                }
                alert("Поставщик упешно добавлен");
                this.setState({
                    org: "",
                    phone: "",
                    legalAddress: "",
                    mailingAddress: "",
                    inn: "",
                    bankDetails: "",
                    generalManager: "",
                    generalAccountant: "",
                });
                $('#addSupplierForm').trigger('reset')
            }.bind(this)
        });
    }

    handleOrgInput(event) {
        this.setState({
            org: event.target.value
        });
    }

    handlePhoneInput(event) {
        this.setState({
            phone: event.target.value
        });
    }

    handleLegalAddressInput(event) {
        this.setState({
            legalAddress: event.target.value
        });
    }

    handleMailingAddressInput(event) {
        this.setState({
            mailingAddress: event.target.value
        });
    }

    handleINNInput(event) {
        this.setState({
            inn: event.target.value
        });
    }

    handleBankDetailsInput(event) {
        this.setState({
            bankDetails: event.target.value
        });
    }

    handleGeneralManagerInput(event) {
        this.setState({
            generalManager: event.target.value
        });
    }

    handleGeneralAccountantInput(event) {
        this.setState({
            generalAccountant: event.target.value
        });
    }

    render() {
        if (cookies.get(Constants.warehouseManagerSession) === undefined) {
            return <Redirect to='/registration/warehouseManager/'/>;
        }
        return (
            <div>
                <WarehouseManagerMainMenu/>
                <div className="container screen-height-container center-block">

                    <form id='addSupplierForm' onSubmit={this.handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="inputOrg">
                                Название организации:
                            </label>
                            <textarea type="text" onChange={this.handleOrgInput}  className="form-control"
                                   id="inputOrg" placeholder="Введите название организации"/>
                            <p id="orgInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputPhone">
                                Телефон:
                            </label>
                            <input type="text" onChange={this.handlePhoneInput}  className="form-control"
                                   id="inputPhone" placeholder="Введите контактный телефон"/>
                            <p id="phoneInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputLegalAddress">
                                Юридический адрес:
                            </label>
                            <textarea type="text" onChange={this.handleLegalAddressInput} className="form-control"
                                   id="inputLegalAddress" placeholder="Введите юридический адрес"/>
                            <p id="legalAddressInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputMailingAddress">
                                Почтовый адрес:
                            </label>
                            <input type="text" onChange={this.handleMailingAddressInput} className="form-control"
                                   id="inputMailingAddress" placeholder="Введите почтовый адрес"/>
                            <p id="mailingAddressInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputINN">
                                ИНН:
                            </label>
                            <input type="text" onChange={this.handleINNInput} className="form-control"
                                   id="inputINN" placeholder="Введите ИНН"/>
                            <p id="innInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputBankDetails">
                                Банковские реквизиты:
                            </label>
                            <textarea type="text" onChange={this.handleBankDetailsInput} className="form-control"
                                   id="inputBankDetails" placeholder="Введите банковские реквизиты"/>
                            <p id="bankDetailsInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputGeneralManager">
                                Генеральный директор:
                            </label>
                            <input type="text" onChange={this.handleGeneralManagerInput} className="form-control"
                                   id="inputGeneralManager" placeholder="Введите ФИО ген. директора"/>
                            <p id="generalManagerInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputGeneralAccountant">
                                Главный бухгалтер:
                            </label>
                            <input type="text" onChange={this.handleGeneralAccountantInput} className="form-control"
                                   id="inputGeneralAccountant" placeholder="Введите ФИО гл. бухгалтера"/>
                            <p id="generalAccountantInfo" className="errorInfo"/>
                        </div>

                        <button id="addSupplierButton" type="submit" className="btn btn-default">
                            Добавить
                        </button>

                    </form>

                </div>
            </div>
        )
    }
}