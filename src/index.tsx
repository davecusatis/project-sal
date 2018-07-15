import * as React from "react";
import { MemoryRouter } from 'react-router-dom';
import { initApp, app } from "./core/app";
import { DevConfig } from "./core/config";

initApp(new DevConfig());

app.mount((
    <MemoryRouter>
        <Root />
    </MemoryRouter>
), document.getElementById('root')!);
