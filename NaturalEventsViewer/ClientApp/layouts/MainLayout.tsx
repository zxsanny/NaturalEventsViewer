﻿import * as React from "react";
import "@Styles/mainLayout.scss";
import { ToastContainer } from "react-toastify";

interface IProps {
    children?: React.ReactNode;
}

type Props = IProps;

export default class MainLayout extends React.Component<Props, {}> {
    public render() {

        return <div id="mainLayout" className="layout">
            {this.props.children}
            <ToastContainer />
        </div>;
    }
}