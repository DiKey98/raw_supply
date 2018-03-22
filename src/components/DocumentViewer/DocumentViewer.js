import React, {Component} from 'react';
import './DocumentViewer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

let img = new Image();

export default class DocumentViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pathToPassport: props.pathToPassport,
            pathToCertificate: props.pathToCertificate,
            isCurrentPassport: true,
        };

        img.src = props.pathToPassport;

        this.removeView = this.removeView.bind(this);
        this.nextDocument = this.nextDocument.bind(this);
    }

    componentDidMount() {
        img.onload = function() {
            $('#docIMG').css({
                'width': this.width + 'px',
                'height': this.height + 'px',
                background: 'url(' + this.src + ')',
            });
        };
    }

    nextDocument(event) {
        event.stopPropagation();

        if (this.state.isCurrentPassport) {
            img.src = this.state.pathToCertificate;
            this.setState({
                isCurrentPassport: false,
            });
        } else {
            img.src = this.state.pathToPassport;
            this.setState({
                isCurrentPassport: true,
            });
        }
    }

    removeView() {
        $("#overlayContainer").remove();
    }

    render() {
        return (
            <div onClick={this.removeView} id='overlay'>

                <button onClick={this.nextDocument} id="arrow-left" />
                <button onClick={this.nextDocument} id="arrow-right" />

                <div id="docIMG" className="documentIMG">
                </div>

            </div>
        )
    }
}