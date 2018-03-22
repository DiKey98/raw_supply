import React, {Component} from 'react';
import Table from '../../../../Table/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RawIncoming.css';
import WarehouseManagerMainMenu from "../../WarehouseManagerMainMenu/WarehouseManagerMainMenu";

let headers = ["Номенклатура", "Поставщик", "Количество", "Цена за ед.", "Общая стоимость",
    "Дата прибытия", "Время прибытия", "Дата прибытия по договору"];

let data = [
    {"f1":"fgfdg", "f2":"fgfdg", "f3":"fgfdg", "f4":"fgfdg", "f5":"fgfdg", "f6":"fgfdg", "f7":"fgfdg", "f8":"fgfdg"},
    {"f1":"aaaaa", "f2":"aaaaa", "f3":"aaaaa", "f4":"aaaaa", "f5":"aaaaa", "f6":"aaaaa", "f7":"aaaaa", "f8":"aaaaa"},
];

export default class RawIncoming extends Component {
    render() {
        return (

            <div>
                <WarehouseManagerMainMenu/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>

                <div className="container-fluid tab">
                    <Table className="text-center"
                           headers={headers}
                           data={data}/>
                </div>

            </div>

        )
    }
}