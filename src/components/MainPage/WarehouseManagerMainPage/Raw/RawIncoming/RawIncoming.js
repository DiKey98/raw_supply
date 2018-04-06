import React, {Component} from 'react';
import Table from '../../../../Table/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RawIncoming.css';
import WarehouseManagerMainMenu from "../../WarehouseManagerMainMenu/WarehouseManagerMainMenu";
import DocumentViewer from '../../../../../components/DocumentViewer/DocumentViewer';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {FormGroup, Radio} from 'react-bootstrap';
import {DateRangePicker} from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Constants from '../../../../config';
import AddIncoming from '../AddIncoming/AddIncoming';
import Utils from "../../../../Utils";

let headers = ["Номенклатура", "Поставщик", "Количество", "Цена за ед.", "Общая стоимость",
    "Дата прибытия", "Время прибытия", "Дата прибытия по договору"];

let data = [
    ["fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg"],
    ["aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa"],
];

export default class RawIncoming extends Component {
    nomenclature = [];
    suppliers = [];
    incoming = [];
    certificates = [];
    passports = [];
    constructor(props) {
        super(props);
        this.showDocuments = this.showDocuments.bind(this);
        this.applyDate = this.applyDate.bind(this);
        this.selectPeriod = this.selectPeriod.bind(this);
        this.selectCurrentDay = this.selectCurrentDay.bind(this);
        this.selectCurrentMonth = this.selectCurrentMonth.bind(this);
        this.showAddForm = this.showAddForm.bind(this);

        this.getNomenclature = this.getNomenclature.bind(this);

        this.nomenclatureToArray = this.nomenclatureToArray.bind(this);
        this.suppliersToArray = this.suppliersToArray.bind(this);
        this.incomingToArray = this.incomingToArray.bind(this);

        this.getIncoming();
    }

    showAddForm() {
        $("body").append("<div id='overlayContainer'></div>");
        $('#overlayContainer').append("<div id='overlay'></div>");
        ReactDOM.render(
            <AddIncoming nomenclature = {this.nomenclature}
                         suppliers = {this.suppliers}/>,
            document.getElementById('overlay')
        )
    }

    applyDate(event, picker) {
        let text = `c ${picker.startDate.format('DD.MM.YYYY')} по ${picker.endDate.format('DD.MM.YYYY')}`;
        $('#period').text(text);
    }

    selectPeriod() {
        $('#period').text("");
        $('#selectPeriod').show()
    }

    selectCurrentDay() {
        $('#selectPeriod').hide();
        $('#period').text("сегодня");
    }

    selectCurrentMonth() {
        $('#selectPeriod').hide();
        $('#period').text("текущий месяц");
    }

    componentDidMount() {
        $('#selectPeriod').hide();
        $('#period').text("сегодня");
        $('#currentDay').attr("checked", "true");
    }

    nomenclatureToArray(objects) {
        if (objects === null) {
            return [];
        }
        let result = [];
        for (let i = 0; i < objects.length; i++) {
            result.push(`${objects[i]['ID']} ${objects[i]['Name']}`);
        }
        return result;
    }

    suppliersToArray(objects) {
        if (objects === null) {
            return [];
        }
        let result = [];
        for (let i = 0; i < objects.length; i++) {
            result.push(`${objects[i]['INN']} ${objects[i]['Name']}`);
        }
        return result;
    }

    incomingToArray(objects) {
        if (objects === null) {
            return [];
        }
        let result = [];
        for (let i = 0; i < objects.length; i++) {
            let tmp =[];
            let totalCost = objects[i]['UnitsCount'] * objects[i]['UnitCost'];
            tmp.push(objects[i]['Nomenclature']);
            tmp.push(objects[i]['Supplier']);
            tmp.push(objects[i]['UnitsCount']);
            tmp.push(`${objects[i]['UnitCost']} ₽`);
            tmp.push(`${totalCost} ₽`);
            tmp.push(objects[i]['IncomingDate']);
            tmp.push(objects[i]['IncomingTime']);
            tmp.push(objects[i]['ContractIncomingDate']);
            result.push(tmp);
            this.certificates.push(objects[i]['Certificate']);
            this.passports.push(objects[i]['Passport']);
        }
        return result;
    }

    componentDidMount() {
        this.getNomenclature();
        Utils.getSuppliers();
        $(document).bind('loadData', function(event, data) {
            this.suppliers = this.suppliersToArray(data);
        }.bind(this));
    }

    getNomenclature() {
        $.ajax ({
            url: "/getNomenclature/",
            method: "POST",
            dataType: 'json',
            success: function (dataFromServer) {
                if (dataFromServer["ErrorInfo"] !== undefined) {
                    return;
                }
                this.nomenclature = this.nomenclatureToArray(dataFromServer);
            }.bind(this)
        });
    }

    getIncoming() {
        $.ajax ({
            url: "/getIncoming/",
            method: "POST",
            dataType: 'json',
            async: false,
            success: function (dataFromServer) {
                if (dataFromServer["ErrorInfo"] !== undefined) {
                    return null;
                }
                this.incoming = this.incomingToArray(dataFromServer);
            }.bind(this)
        });
    }

    render() {
        return (

            <div>
                <WarehouseManagerMainMenu/>
                <br/>

                <div className="container-fluid tab">

                    <FormGroup id="selectIncoming">

                        <Radio id='currentDay'
                               onChange={this.selectCurrentDay}
                               name="radioGroup"
                               className="incomingOption" inline>
                            За сегодня
                        </Radio>

                        <Radio id='currentMonth'
                               onChange={this.selectCurrentMonth}
                               name="radioGroup"
                               className="incomingOption" inline>
                            За текущий месяц
                        </Radio>

                        <Radio id='periodRadio'
                               onChange={this.selectPeriod}
                               name="radioGroup"
                               className="incomingOption" inline>
                            За период
                        </Radio>

                        <DateRangePicker id='datePicker'
                                         locale={Constants.datePickerLocale}
                                         onApply={this.applyDate}
                                         >
                            <button id='selectPeriod'>
                                Выбрать период
                            </button>
                        </DateRangePicker>

                    </FormGroup>

                    <div id="period">
                    </div>

                    <button onClick={this.showAddForm} id='addIncoming'>
                        Добавить
                    </button>

                    <Table className="text-center"
                           headers={headers}
                           data={this.incoming}
                           tdClick={this.showDocuments}
                    />
                </div>

            </div>

        )
    }

    showDocuments(event) {
        if (headers[event.target.dataset.idx % headers.length] !== headers[0]) {
            return;
        }

        $("body").append("<div id='overlayContainer'></div>");
        ReactDOM.render(<DocumentViewer pathToPassport={this.passports[event.target.dataset.row]}
                                        pathToCertificate={this.certificates[event.target.dataset.row]} />,
            document.getElementById('overlayContainer'));
    }
}