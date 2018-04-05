import React, {Component} from 'react';
import './Table.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import ReactDOM from 'react-dom';
import { NavDropdown, MenuItem } from 'react-bootstrap';

let statuses = ["Надежный", "Ненадежный", "Нет статуса"];
let statusColors = ["springgreen", "red", "black"];

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
        this.clickDropDown = this.clickDropDown.bind(this);
        this.replaceStatus = this.replaceStatus.bind(this);
    }

    focusSearchField(event){
        for (let i = 0; i < this.state.data.length; i++) {
            let idx = (i+1)*this.state.headers.length - 1;
            ReactDOM.unmountComponentAtNode(document.getElementById(`dataCell${idx}`))
        }

        $('.searchField').val('');
        this.setState({
            data: this.state.preSearchData,
        });
    }

    componentDidUpdate() {
        if (this.props.replaceStatus) {
            this.replaceStatus();
        }
    }

    search(event) {
        for (let i = 0; i < this.state.data.length; i++) {
            let idx = (i+1)*this.state.headers.length - 1;
            ReactDOM.unmountComponentAtNode(document.getElementById(`dataCell${idx}`))
        }

        let needle = event.target.value.toLowerCase();

        if (!needle) {
            this.setState({
                data: this.state.preSearchData
            });
            return;
        }

        //let oldHtml = $(`#dataCell${idx}`).html();

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
            return descending
                ? x[column] < y[column] ? 1 : -1
                : x[column] > y[column] ? 1 : -1
        });
        this.setState({
            data: data,
            sortBy: column,
            descending: descending,
        });

        for (let i = 0; i < this.state.data.length; i++) {
            let idx = (i+1)*this.state.headers.length - 1;
            ReactDOM.unmountComponentAtNode(document.getElementById(`dataCell${idx}`))
        }
    }

    render() {
        return (
            <div className={this.props.className}>
                <table id="dataTable">
                    <thead onClick={this.sort}>
                    <tr className="tableHeaders">
                        {this.state.headers.map(function (title, idx) {
                            if (this.state.sortBy === idx) {
                                title += this.state.descending ? '\u2193' : '\u2191'
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
                    {this.state.data.map(function (row, idx_row) {
                        return (
                            <tr key={idx_row}>
                                {row.map(function (cell, idx_column) {
                                    return (
                                        <td data-idx={idx_row*row.length+idx_column}
                                            data-row={idx_row}
                                            onClick={this.props.tdClick}
                                            id={`dataCell${idx_row*row.length+idx_column}`}
                                            className="dataCell" key={idx_column}>
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

    replaceStatus() {
        for (let i = 0; i < this.state.data.length; i++) {
            let idx = (i+1)*this.state.headers.length - 1;
            let oldHtml = this.state.data[i][this.state.data[i].length-1];
            ReactDOM.render(<MenuItems statuses={statuses}
                                       index={i}
                                       oldHtml={oldHtml}
                                       onClick={this.clickDropDown}/>,
                document.getElementById(`dataCell${idx}`)
            );
        }
    }

    clickDropDown(event) {
        event.stopPropagation();
        let idx = event.target.dataset.idx;
        let dropidx = event.target.dataset.dropidx;
        $(`a#dropdown${dropidx}`).html(statuses[idx] + '<span class="caret"> </span>').css({
            color: statusColors[idx],
        });
        this.state.data[dropidx][this.state.data[dropidx].length-1] = statuses[idx];
    }
}

class MenuItems extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let dropdown = $(`a#dropdown${this.props.index}`);
        let text = dropdown.text();
        text = text.slice(0, text.length-1);
        dropdown.css({
            color: statusColors[statuses.indexOf(text)],
        });
    }

    render() {
        const listItems = this.props.statuses.map((value, index) =>
            <MenuItem key={index}
                      id={`menuItem${this.props.index*this.props.statuses.length + index}`}
                      onClick={this.props.onClick}
                      data-idx={index}
                      data-dropidx={this.props.index}>
                {value}
            </MenuItem>
        );
        return (
            <NavDropdown id={`dropdown${this.props.index}`}
                         className="dropdowns"
                         data-idx={this.props.index}
                         title={this.props.oldHtml}>
                {listItems}
            </NavDropdown>
        )
    }
}