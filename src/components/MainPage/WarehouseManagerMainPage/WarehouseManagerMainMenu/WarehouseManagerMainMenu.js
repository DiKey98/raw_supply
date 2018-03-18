import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import './WarehouseManagerMainMenu.css';
import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem } from 'react-bootstrap';

export default class WarehouseManagerMainMenu extends Component {

    render() {

        return (

            <nav className="navbar navbar-inverse font">

                <div className="container-fluid">

                    <ul className="nav nav-pills nav-justified">

                        <li role="presentation"><Link to='/'>На главную</Link></li>

                        <NavDropdown title="Сырьё" id="rawSubMenu">
                            <MenuItem className="subMenuItem" href='#'>Приход сырья</MenuItem>
                            <MenuItem className="subMenuItem" href='#'>Расход сырья</MenuItem>
                            <MenuItem className="subMenuItem" href='#'>Остаток сырья</MenuItem>
                            <MenuItem className="subMenuItem" href='#'>Сырьё в пути</MenuItem>
                        </NavDropdown>

                        <NavDropdown title="Поставщики" id="suppliersSubMenu">
                            <MenuItem className="subMenuItem" href='#main/warehouseManager/suppliers/add/'>
                                Добавить поставщика
                            </MenuItem>
                            <MenuItem className="subMenuItem" href='/'>
                                Статус поставщиков
                            </MenuItem>
                        </NavDropdown>

                        <li role="presentation"><Link to='/'>Выход</Link></li>

                    </ul>
                </div>
            </nav>
        )
    }
}