import React, {Component} from 'react';
import Table from '../../../../Table/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RawIncoming.css';
import WarehouseManagerMainMenu from "../../WarehouseManagerMainMenu/WarehouseManagerMainMenu";
import DocumentViewer from '../../../../../components/DocumentViewer/DocumentViewer';
import ReactDOM from 'react-dom';
import $ from 'jquery';

let headers = ["Номенклатура", "Поставщик", "Количество", "Цена за ед.", "Общая стоимость",
    "Дата прибытия", "Время прибытия", "Дата прибытия по договору"];

let data = [
    ["fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg" , "fgfdg"],
    ["aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa" , "aaaaa"],
];

export default class RawIncoming extends Component {
    constructor(props) {
        super(props);
        this.showDocuments = this.showDocuments.bind(this);
    }

    render() {
        return (

            <div>
                <WarehouseManagerMainMenu/>
                <br/>

                <div className="container-fluid tab">
                    <Table className="text-center"
                           headers={headers}
                           data={data}
                           tdClick={this.showDocuments}
                    />
                </div>

            </div>

        )
    }

    showDocuments(event) {
        if (headers[event.target.dataset.idx] !== headers[0]) {
            return;
        }

        $("body").append("<div id='overlayContainer'></div>");
        ReactDOM.render(<DocumentViewer pathToPassport="upload/passport/test_passport.jpg"
                                        pathToCertificate="upload/certificate/test_certificate.jpg" />,
            document.getElementById('overlayContainer'));
    }
}