import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { initApp, app } from './core/app';
import { DevConfig } from './core/config';
import { Root } from './pages/root';

initApp(new DevConfig());

app.mount((
    <MemoryRouter>
        <Root />
    </MemoryRouter>
), document.getElementById('root')!);
