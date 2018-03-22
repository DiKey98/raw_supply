import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Table.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import DocumentViewer from '../../components/DocumentViewer/DocumentViewer';

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            headers: props.headers,
            data: props.data,
            sortBy: null,
            descending: false,
            preSearchData: props.data,

        };
        this.sort = this.sort.bind(this);
        this.search = this.search.bind(this);
        this.focusSearchField = this.focusSearchField.bind(this);
        this.showDocuments = this.showDocuments.bind(this);
        this.JSONToArray = this.JSONToArray.bind(this);
    }

    JSONToArray(obj) {
        let result = [];
        Object.keys(obj).forEach(function (key) {
            result.push(obj[key])
        });
        return result;
    }

    showDocuments(event) {
        if (this.state.headers[event.target.dataset.idx] !== "Номенклатура") {
            return;
        }

        $("body").append("<div id='overlayContainer'></div>");
        ReactDOM.render(<DocumentViewer pathToPassport="upload/passport/test_passport.jpg"
                                        pathToCertificate="upload/certificate/test_certificate.jpg" />,
            document.getElementById('overlayContainer'));
    }

    focusSearchField(event){
        $('.searchField').val('');
        this.setState({
            data: this.state.preSearchData,
        });
    }

    search(event) {
        let needle = event.target.value.toLowerCase();

        if (!needle) {
            this.setState({
                data: this.state.preSearchData
            });
            return;
        }

        let idx = event.target.dataset.idx;
        let searchData = this.state.preSearchData.filter(function (row) {
            return row[idx].toString().toLowerCase().indexOf(needle) > -1;
        });

        this.setState({
            data: searchData
        });
    }

    sort(event) {
        let column = event.target.cellIndex;
        let data = Array.from(this.state.data);
        let descending = this.state.sortBy === column && !this.state.descending;
        data.sort(function (x, y) {
            if (typeof x === "number" && typeof y === "number") {
                return descending
                    ? x < y ? 1 : -1
                    : x > y ? 1 : -1
            }
            return descending
                ? x[column] < y[column] ? 1 : -1
                : x[column] > y[column] ? 1 : -1
        });
        this.setState({
            data: data,
            sortBy: column,
            descending: descending,
        });
    }

    render() {
        return (
            <div className={this.props.className}>
                <table id="dataTable">
                    <thead onClick={this.sort}>
                    <tr className="tableHeaders">
                        {this.state.headers.map(function (title, idx) {
                            if (this.state.sortBy === idx) {
                                title += this.state.descending ? ' \u2191' : ' \u2193'
                            }
                            return (
                                <th key={idx}>
                                    {title}
                                </th>
                            )
                        }.bind(this))
                        }
                    </tr>
                    <tr onChange={this.search} className="tableSearch">
                        {this.state.headers.map(function (title, idx) {
                            return (
                                <th key={idx}>
                                    <input onFocus={this.focusSearchField}
                                           id={`searchField${idx}`}
                                           className="searchField"
                                           type="text"
                                           placeholder="поиск..."
                                           data-idx={idx}/>
                                </th>
                            )
                        }.bind(this))
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.data.map(function (row, idx) {
                        return (
                            <tr key={idx}>
                                {this.JSONToArray(row).map(function (cell, idx) {
                                    return (
                                        <td data-idx={idx} onClick={this.showDocuments} id="dataCell" key={idx}>
                                            {cell}
                                        </td>
                                    )
                                }.bind(this))}
                            </tr>
                        )
                    }.bind(this))}
                    </tbody>
                </table>
            </div>
        )
    }
}