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

        this.save = this.save.bind(this);
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

        Utils.getIncoming(false, picker.startDate.format('DD.MM.YYYY'), picker.endDate.format('DD.MM.YYYY'));
        $(document).bind('loadIncoming', function(event, data) {
            this.incoming = this.incomingToArray(data);
            ReactDOM.unmountComponentAtNode(document.getElementById('incomingTable'));
            ReactDOM.render(
                <Table className="text-center"
                       headers={headers}
                       data={this.incoming}
                       save={this.save}
                       tdClick={this.showDocuments}
                />,
                document.getElementById('incomingTable')
            );
        }.bind(this));
    }

    selectPeriod() {
        $('#period').text("");
        $('#selectPeriod').show();
    }

    selectCurrentDay() {
        $('#selectPeriod').hide();
        $('#period').text("сегодня");

        Utils.getIncoming();
        $(document).bind('loadIncoming', function(event, data) {
            this.incoming = this.incomingToArray(data);
            ReactDOM.unmountComponentAtNode(document.getElementById('incomingTable'));
            ReactDOM.render(
                <Table className="text-center"
                       headers={headers}
                       data={this.incoming}
                       save={this.save}
                       tdClick={this.showDocuments}
                />,
                document.getElementById('incomingTable')
            );
        }.bind(this));
    }

    selectCurrentMonth() {
        $('#selectPeriod').hide();
        $('#period').text("текущий месяц");

        Utils.getIncoming(true);
        $(document).bind('loadIncoming', function(event, data) {
            this.incoming = this.incomingToArray(data);
            ReactDOM.unmountComponentAtNode(document.getElementById('incomingTable'));
            ReactDOM.render(
                <Table className="text-center"
                       headers={headers}
                       data={this.incoming}
                       save={this.save}
                       tdClick={this.showDocuments}
                />,
                document.getElementById('incomingTable')
            );
        }.bind(this));
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
            tmp.push(objects[i]['ID']);
            tmp.push(objects[i]['IDSupplier']);
            result.push(tmp);
            this.certificates.push(objects[i]['Certificate']);
            this.passports.push(objects[i]['Passport']);
        }
        return result;
    }

    componentDidMount() {
        $('#selectPeriod').hide();
        $('#period').text("сегодня");
        $('#currentDay').attr("checked", "true");

        this.getNomenclature();

        Utils.getSuppliers();
        $(document).bind('loadSuppliers', function(event, data) {
            this.suppliers = this.suppliersToArray(data);
        }.bind(this));

        Utils.getIncoming();
        $(document).bind('loadIncoming', function(event, data) {
            this.incoming = this.incomingToArray(data);
            ReactDOM.render(
                <Table className="text-center"
                       headers={headers}
                       data={this.incoming}
                       save={this.save}
                       tdClick={this.showDocuments}
                />,
                document.getElementById('incomingTable')
            );
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

                    <div className="container-fluid tab" id="incomingTable">
                    <Table className="text-center"
                           headers={headers}
                           data={data}
                           save={this.save}
                           tdClick={this.showDocuments}
                    />
                    </div>
                </div>

            </div>

        )
    }

    showDocuments(event) {
        event.preventDefault();

        if (headers[event.target.dataset.idx % headers.length] !== headers[0]) {
            return;
        }

        $("body").append("<div id='overlayContainer'></div>");
        ReactDOM.render(<DocumentViewer pathToPassport={this.passports[event.target.dataset.row]}
                                        pathToCertificate={this.certificates[event.target.dataset.row]} />,
            document.getElementById('overlayContainer'));
    }

    save(event, row, column, data) {
        this.incoming = data;

        let units = parseInt(data[row][2], 10);
        let unitCost = parseInt(data[row][3].split(" ")[0], 10);
        data[row][4] = `${units * unitCost} ₽`;

        $.ajax({
            url: "/updateIncoming/",
            method: "POST",
            dataType: "JSON",
            data: {
                nomenclature: data[row][0],
                unitsCount: data[row][2],
                unitCost: data[row][3],
                incomingDate: data[row][5],
                incomingTime: data[row][6],
                contractIncomingDate: data[row][7],
                id: data[row][8],
                supplier: data[row][9],
            }
        });

        return data;
    }
}