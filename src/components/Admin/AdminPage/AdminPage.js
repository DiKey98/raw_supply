import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import './AdminPage.css';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

const data = [
    {ID: 1, Login: "DiKey98", FIO: "Иванов И.И", Role: "Менеджер склада"},
    {ID: 2, Login: "Iva98", FIO: "Иванов А.И.", Role: "Менеджер склада"},
    {ID: 3, Login: "P128IV", FIO: "Петров И.В.", Role: "Менеджер склада"},
    {ID: 4, Login: "Kor95", FIO: "Корнеев А.В.", Role: "Менеджер склада"},
    {ID: 5, Login: "Kr777", FIO: "Кретов П.И.", Role: "Менеджер склада"},
    {ID: 16, Login: "Smr2007", FIO: "Смирнов М.М", Role: "Менеджер склада"}
];

export default class AdminPage extends React.Component {
    cookies = new Cookies();
    numbers = [];
    idData = [];
    idConfirm = [];
    idDelete = [];
    data = [];

    constructor(props) {
        super(props);
        AdminPage.stringFromJSON = AdminPage.stringFromJSON.bind(this);
        this.getUnverifiedUsers = this.getUnverifiedUsers.bind(this);
        this.confirmWarehouseManagerHandler = this.confirmWarehouseManagerHandler.bind(this);
        this.deleteWarehouseManagerHandler = this.deleteWarehouseManagerHandler.bind(this);
        this.getUnverifiedUsers();
    }

    static stringFromJSON(jsonObj) {
        let result = "";
        for (let key in jsonObj) {
            if (!jsonObj.hasOwnProperty(key)) {
                continue;
            }
            result += jsonObj[key] + " "
        }
        return result;
    }

    confirmWarehouseManagerHandler(event, number) {
        this.data.splice(number, 1);
        $(`#manager${number}`).remove();
    }

    deleteWarehouseManagerHandler(event, number) {
        this.data.splice(number, 1);
        $(`#manager${number}`).remove();
    }

    getUnverifiedUsers() {
        $.ajax({
            url: '/getUnverifiedUsers/',
            async: false,
            method: 'POST',
            dataType: 'JSON',
            success: function (dataFromServer) {
                for (let i = 0; i < dataFromServer.length; i++) {
                    this.numbers.push(i);
                    this.idData.push(`idData${i}`);
                    this.idConfirm.push(`confirm${i}`);
                    this.idDelete.push(`delete${i}`);
                    this.data[i] = dataFromServer[i];
                }
            }.bind(this)
        })
    }

    componentDidMount() {
        if (this.cookies.get('adminAuthenticated') === undefined) {
            return;
        }
        $('#unverifiedUsersContainer').bind('confirmWarehouseManager', this.confirmWarehouseManagerHandler)
            .bind('deleteWarehouseManager', this.confirmWarehouseManagerHandler);

        ReactDOM.render(<UnverifiedUsersList idConfirm={this.idConfirm}
                                             idDelete={this.idDelete}
                                             idData={this.idData}
                                             data={this.data}
                                             numbers={this.numbers}/>,
            document.getElementById('unverifiedUsersContainer'))
    }

    render() {
        if (this.cookies.get('adminAuthenticated') === undefined) {
            return (
                <Redirect to='/admin/authorization/'/>
            )
        }
        return (
            <div ref={(AdminPage)=>{this.domNode = AdminPage;}}>
                <div id="unverifiedUsersContainer" className="container center-block">
                </div>
            </div>
        )
    }
};

class Block extends React.Component {
    constructor(props) {
        super(props);
        this.confirmUser = this.confirmUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    confirmUser() {
        $(`#${this.props.idData}`).trigger('confirmWarehouseManager', this.props.number);
        $.ajax({
            url: '/confirmWarehouseManager/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                id: this.props.data["ID"]
            }
        })
    }

    deleteUser() {
        $(`#${this.props.idData}`).trigger('deleteWarehouseManager', this.props.number);
        $.ajax({
            url: '/deleteWarehouseManager/',
            method: 'POST',
            dataType: 'JSON',
            data: {
                id: this.props.data["ID"]
            }
        })
    }

    render() {
        return (
            <div id={`manager${this.props.number}`} className="unverifiedUser" ref={(Block)=>{this.domNode = Block;}}>

                <div className="usersData" id={this.props.idData}>
                    {AdminPage.stringFromJSON(this.props.data)}
                </div>
                <button id={this.props.idConfirm} onClick={this.confirmUser} className="btn btn-default control">
                    Подтвердить
                </button>
                <button id={this.props.idDelete} onClick={this.deleteUser} className="btn btn-default control">
                    Удалить
                </button>

            </div>
        )
    }
}

class UnverifiedUsersList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const listItems = this.props.numbers.map((i) =>
            <Block key={i}
                   idData={this.props.idData[i]}
                   idConfirm={this.props.idConfirm[i]}
                   idDelete={this.props.idDelete[i]}
                   data={this.props.data[i]}
                   number={i}/>
        );
        return (
            <div id="undefinedUsersList">{listItems}</div>
        );
    }
}