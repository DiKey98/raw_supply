import React, {Component} from 'react';
import $ from 'jquery';
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import './AdminPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminMenu from '../AdminMenu/AdminMenu';
import Constants from '../../config';

let cookies = new Cookies();

export default class AdminPage extends Component {
    redirectToMain = false;

    componentDidMount() {
        $('#exitAdminButton').click(function () {
            $.ajax({
                url: '/logoutAdmin/',
                method: 'POST',
                dataType: 'JSON',
                data: {
                    sessionName: Constants.adminSession,
                    role: Constants.adminRole,
                },
                success: function (dataFromServer) {
                    if(dataFromServer["OK"]) {
                        cookies.remove(Constants.adminSession);
                    }
                }
            });
        });
    }

    render() {
        if(this.redirectToMain) {
            return (
                <Redirect to='/'/>
            )
        }
        if (cookies.get(Constants.adminSession) === undefined) {
            return (
                <Redirect to='/admin/authorization/'/>
            )
        }
        return (
            <div>
                <AdminMenu/>
            </div>
        )
    }
};