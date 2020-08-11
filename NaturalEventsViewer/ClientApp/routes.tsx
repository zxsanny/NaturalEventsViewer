import * as React from 'react';
import MainLayout from '@Layouts/MainLayout';
import AppRoute from "@Components/shared/AppRoute";
import EventsPage from '@Pages/EventsPage';
import { Switch } from 'react-router-dom';
import NotFoundPage from '@Pages/NotFoundPage';

export const routes =
    <Switch>
        <AppRoute layout={MainLayout} exact path="/" component={EventsPage} />
        <AppRoute layout={MainLayout} path="*" component={NotFoundPage} statusCode={404} />
    </Switch>;