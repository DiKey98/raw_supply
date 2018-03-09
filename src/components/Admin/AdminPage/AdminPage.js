import React, {Component} from 'react';
import $ from 'jquery';
import './AdminPage.css';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AdminPage extends React.Component {
    cookies = new Cookies();
    unverifiedUsers = [];
    unverifiedUsersComponents = [];

    constructor(props) {
        super(props);
        this.state = {
            unverifiedUsers : [],
        };
        this.getUnverifiedUsers = this.getUnverifiedUsers.bind(this);
    }

    getUnverifiedUsers() {
        $.ajax({
            url: '/getUnverifiedUsers/',
            method: 'POST',
            dataType: 'JSON',
            success: function (dataFromServer) {
                this.setState({
                    unverifiedUsers: dataFromServer,
                });
                this.unverifiedUsers = dataFromServer;
            }.bind(this)
        });
    }

    componentDidMount() {
        this.getUnverifiedUsers();
        this.forceUpdate();
        for (let i = 0; i < this.state.unverifiedUsers.length; i++) {
            this.unverifiedUsersComponents.push(<Block key={i} idConfirm={`confirm${i}`}
                                                  idDelete={`delete${i}`}
                                                  idData={`data${i}`}/>)
        }
        alert(this.unverifiedUsersComponents.length);
}


    render() {
        if (!this.cookies.get('adminAuthenticated')) {
            return (
                <Redirect to='/admin/authorization/'/>
            )
        }
        return (
            <div>
                <div id="unverifiedUsersContainer">
                    {this.unverifiedUsersComponents}
                </div>
            </div>
        )
    }
};

class Block extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idConfirm: "",
            idDelete: "",
            idData: "",
        }
    }

    render() {
        return (
            <div>
                <div id={this.state.idData}>
                </div>
                <button id={this.state.idConfirm} className="btn btn-default">
                    Подтвердить
                </button>
                <button id={this.state.idDelete} className="btn btn-default">
                    Удалить
                </button>
            </div>
        )
    }
}