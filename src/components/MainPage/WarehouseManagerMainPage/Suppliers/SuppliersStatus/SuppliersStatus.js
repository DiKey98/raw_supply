import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Constants from '../../../../config';
import { Redirect } from 'react-router';
import './SuppliersStatus.css'
import WarehouseManagerMainMenu from "../../WarehouseManagerMainMenu/WarehouseManagerMainMenu";
import Cookies from 'universal-cookie';
import Table from '../../../../Table/Table';
import Utils from '../../../../Utils';
import $ from 'jquery';

let cookies = new Cookies();

let headers = ["Организация", "ИНН", "Телефон", "Юридический адрес", "Ген. директор", "Гл. бухгалтер", "Статус"];
let data = [
    ["fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg", "gfg", "Надежный"],
    ["aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa", "gfg", "Нет статуса"],
];
let statuses = ["Надежный", "Ненадежный", "Нет статуса"];
let statusColors = ["springgreen", "red", "blue"];

export default class SuppliersStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statuses: null,
            oldHtml: null,
            suppliers: [],
        };

        this.showStatuses = this.showStatuses.bind(this);
        this.suppliersToArray = this.suppliersToArray.bind(this);
    }

    componentDidMount() {
        Utils.getSuppliers();
        $(document).bind('loadSuppliers', function(event, data) {
            this.setState({
                suppliers: this.suppliersToArray(data),
                statuses: statuses,
            });
            ReactDOM.render(
                <Table className="text-center"
                       headers={headers}
                       data={this.state.suppliers}
                       tdClick={this.showStatuses}
                       replaceStatus={true}
                />,
                document.getElementById('suppliersTable')
            );
        }.bind(this));
    }

    showStatuses(event) {

    }

    suppliersToArray(objects) {
        if (objects === null) {
            return [];
        }
        let result = [];
        for (let i = 0; i < objects.length; i++) {
            let tmp = [];
            tmp.push(objects[i]['Name']);
            tmp.push(objects[i]['INN']);
            tmp.push(objects[i]['Phone']);
            tmp.push(objects[i]['LegalAddress']);
            tmp.push(objects[i]['GeneralManager']);
            tmp.push(objects[i]['GeneralAccountant']);
            tmp.push(objects[i]['Status']['String']);

            result.push(tmp);
        }
        return result;
    }

    render() {
        if (cookies.get(Constants.warehouseManagerSession) === undefined) {
            return <Redirect to='/registration/warehouseManager/'/>;
        }

        return (

            <div>
                <WarehouseManagerMainMenu/>
                <br/>

                <div className="container-fluid tab" id="suppliersTable">
                    <Table className="text-center"
                           headers={headers}
                           data={this.state.suppliers}
                           tdClick={this.showStatuses}
                           replaceStatus={true}
                    />
                </div>

            </div>

        )
    }
}