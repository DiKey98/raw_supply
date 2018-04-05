import React, {Component} from 'react';
import './AddIncoming.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import { NavDropdown, MenuItem } from 'react-bootstrap';

let nomenclature = ["1 Катанка", "2 Пластикат", "3 Маркеры"];
let suppliers = ['ИНН cxvcxvcxvcxv ОАО "ККЗ"', 'ИНН cxvcxvcxvcxv ОАО "ККЗ"', 'ИНН cxvcxvcxvcxv ОАО "ККЗ"'];

export default class AddIncoming extends Component {
    constructor(props) {
        super(props);
        this.removeView = this.removeView.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUnitsCountInput = this.handleUnitsCountInput.bind(this);
        this.handleUnitCostInput = this.handleUnitCostInput.bind(this);
        this.handleIncomingDateInput = this.handleIncomingDateInput.bind(this);
        this.handleIncomingTimeInput = this.handleIncomingTimeInput.bind(this);
        this.handleContractIncomingDateInput = this.handleContractIncomingDateInput.bind(this);
        this.handleCertificateInput = this.handleCertificateInput.bind(this);
        this.handlePassportInput = this.handlePassportInput.bind(this);

        this.state = {
            certificate: null,
            passport: null,
            unitsCount: null,
            unitCost: null,
            incomingDate: null,
            incomingTime: null,
            contractIncomingDate: null
        };

        this.nomenclature = props.nomenclature;
        this.suppliers = props.suppliers;
    }

    removeView() {
        $("#overlayContainer").remove();
    }

    handleSubmit() {
        let data = new FormData();
        let supplierINN = $('#supplier').text().split(" ")[0];
        let nomenclatureId = $('#nomenclature').text().split(" ")[0];

        data.append("nomenclature", nomenclatureId);
        data.append("supplier", supplierINN);
        data.append("certificate", this.state.certificate);
        data.append("passport", this.state.passport);
        data.append("unitsCount", this.state.unitsCount);
        data.append("unitCost", this.state.unitCost);
        data.append("incomingDate", this.state.incomingDate);
        data.append("incomingTime", this.state.incomingTime);
        data.append("contractIncomingDate", this.state.contractIncomingDate);

        $.ajax ({
            url: "/addIncoming/",
            method: "POST",
            contentType: false,
            processData: false,
            dataType: 'json',
            data: data,
            success: function (dataFromServer) {
                if (dataFromServer["ErrorInfo"] === "") {
                    alert("Данные успешно добавлены");
                    $('#addIncomingForm').trigger('reset');
                }
            }
        });
    }

    handleUnitsCountInput(event) {
        this.setState({
            unitsCount: event.target.value,
        });
    }

    handleUnitCostInput(event) {
        this.setState({
            unitCost: event.target.value,
        });
    }

    handleIncomingDateInput(event) {
        this.setState({
            incomingDate: event.target.value,
        });
    }

    handleIncomingTimeInput(event) {
        this.setState({
            incomingTime: event.target.value,
        });
    }

    handleContractIncomingDateInput(event) {
        this.setState({
            contractIncomingDate: event.target.value,
        });
    }

    handleCertificateInput(event) {
        this.setState({
            certificate: event.target.files[0],
        });
    }

    handlePassportInput(event) {
        this.setState({
            passport: event.target.files[0],
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.removeView} id="exitToRawIncoming">
                    Выйти
                </button>
                <div className="container screen-height-container center-block">

                    <form encType="multipart/form-data" id='addIncomingForm' onSubmit={this.handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="nomenclature">
                                Номенклатура:
                            </label>
                            <MenuItems items={this.nomenclature}
                                       idMenuItem={"itemNomenclature"}
                                       idDropdown={"nomenclature"}
                                       classNameDropdown={"dropdownNomenclature"}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="supplier">
                                Поставщик:
                            </label>
                            <MenuItems items={this.suppliers}
                                       idMenuItem={"itemSupplier"}
                                       idDropdown={"supplier"}
                                       classNameDropdown={"dropdownSupplier"}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputUnits">
                                Число ед.:
                            </label>
                            <input type="text" onChange={this.handleUnitsCountInput} className="form-control"
                                      id="inputUnits" placeholder="Введите количество единиц"/>
                            <p id="unitsInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputUnitCost">
                                Стоимость ед. Р:
                            </label>
                            <input type="text" onChange={this.handleUnitCostInput} className="form-control"
                                      id="inputUnitCost" placeholder="Введите стоимость единицы"/>
                            <p id="unitCostInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputIncomingDate">
                                Дата прибытия:
                            </label>
                            <input type="text" onChange={this.handleIncomingDateInput} className="form-control"
                                   id="inputIncomingDate" placeholder="Введите дату прибытия"/>
                            <p id="incomingDateInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputIncomingTime">
                                Время прибытия:
                            </label>
                            <input type="text" onChange={this.handleIncomingTimeInput} className="form-control"
                                   id="inputIncomingTime" placeholder="Введите время прибытия"/>
                            <p id="incomingTimeInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputContractIncomingDate">
                                Дата прибытия по договору:
                            </label>
                            <input type="text" onChange={this.handleContractIncomingDateInput} className="form-control"
                                   id="inputContractIncomingDate" placeholder="Введите дату прибытия по договору"/>
                            <p id="contractIncomingDateInfo" className="errorInfo"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputCertificate">
                                Сертификат:
                            </label>
                            <input type="file"
                                   id="inputCertificate"
                                   accept="application/pdf"
                                   required={true}
                                   onChange={this.handleCertificateInput}/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="inputPassport">
                                Паспорт:
                            </label>
                            <input type="file"
                                   id="inputPassport"
                                   accept="application/pdf"
                                   required={true}
                                   onChange={this.handlePassportInput}/>
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

class MenuItems extends Component {
    constructor(props) {
        super(props);
        this.clickItem = this.clickItem.bind(this);
    }

    componentDidMount() {
    }

    clickItem(event) {
        let text = $(`#${event.target.id}`).html();
        $(`#${this.props.idDropdown}`).html(text + '<span class="caret"></span>');
    }

    render() {
        const listItems = this.props.items.map((value, index) =>
            <MenuItem key={index}
                      id={`${this.props.idMenuItem}${index}`}
                      onClick={this.clickItem}
                      data-idx={index}>
                {value}
            </MenuItem>
        );
        return (
            <NavDropdown id={`${this.props.idDropdown}`}
                         className={`${this.props.classNameDropdown}`}
                         title={this.props.items[0]}>
                {listItems}
            </NavDropdown>
        )
    }
}