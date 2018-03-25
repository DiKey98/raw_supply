import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Constants from '../../../../config';
import { Redirect } from 'react-router';
import './SuppliersStatus.css'
import WarehouseManagerMainMenu from "../../WarehouseManagerMainMenu/WarehouseManagerMainMenu";
import Cookies from 'universal-cookie';
import Table from '../../../../Table/Table';

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
        };

        this.showStatuses = this.showStatuses.bind(this);

    }

    componentDidMount() {
        this.setState({
            statuses: statuses,
        });
    }

    showStatuses(event) {

    }

    render() {
        if (cookies.get(Constants.warehouseManagerSession) === undefined) {
            return <Redirect to='/registration/warehouseManager/'/>;
        }
        return (

            <div>
                <WarehouseManagerMainMenu/>
                <br/>

                <div className="container-fluid tab">
                    <Table className="text-center"
                           headers={headers}
                           data={data}
                           tdClick={this.showStatuses}
                           replaceStatus={true}
                    />
                </div>

            </div>

        )
    }
}