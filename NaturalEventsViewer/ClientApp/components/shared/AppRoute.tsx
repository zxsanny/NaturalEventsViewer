import * as React from "react";
import { Route, RouteProps } from "react-router";
import responseContext from "@Core/responseContext";

export interface IProps extends RouteProps {
    layout: React.ComponentClass<any>;
    statusCode?: number;
}

const AppRoute: React.FC<IProps> =
    ({ component: Component, layout: Layout, statusCode: statusCode, ...rest }: IProps) => {

        if (statusCode === null) {
            responseContext.statusCode = 200;
        } else {
            responseContext.statusCode = statusCode;
        }

        return <Route {...rest} render={props => (
            <Layout>
                <Component {...props} />
            </Layout>
        )} />;
    };

export default AppRoute;