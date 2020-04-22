/**
 * Copyright © 2016-present Kriasoft.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import path from 'path';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import i18next from 'i18next';
import i18nextMiddleware, {
  LanguageDetector
} from 'i18next-express-middleware';
import i18nextBackend from 'i18next-node-fs-backend';
import PrettyError from 'pretty-error';
import expressOasGenerator from 'express-oas-generator';
import session from 'express-session';
import corsOptions from './cors';
// import passport from './passport.js';
import user from './routes/user'; // TODO: REMOVE the user route.
import tokenRequest from './routes/tokenRequest';
import healthcheck from './routes/healthCheck';
import * as UserService from './services/user-service';

i18next
  .use(LanguageDetector)
  .use(i18nextBackend)
  .init({
    preload: ['en', 'de'],
    ns: ['common', 'email'],
    fallbackNS: 'common',
    detection: {
      lookupCookie: 'lng'
    },
    backend: {
      loadPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      addPath: path.resolve(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
    }
  });

const app = express();

if (process.env.NODE_ENV !== 'production') {
  expressOasGenerator.init(app, spec => {
    const newspec = {
      ...spec,
      info: { title: 'Skeleton' },
      host: 'localhost:8080'
    };
    return newspec;
  });
}

// app.use(passport.initialize());

app.set('trust proxy', 'loopback');

app.use(cors(corsOptions));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  session({
    // store: new (connectRedis(session))({ client: redis }),
    name: 'sid',
    resave: true,
    saveUninitialized: true,
    secret: 'cats',
    cookie: {
      _expires: 7776000000
    }
  })
);
app.use(i18nextMiddleware.handle(i18next));
// app.use(passport.session());
app.use(flash());

app.use('/user', user);
app.use('/token-request', tokenRequest);
app.use('/healthcheck', healthcheck);

UserService.prepareHourDayWeakLimitData();
// The following routes are intended to be used in development mode only
// TODO : Remove Me
if (process.env.NODE_ENV !== 'production') {
  // A route for testing authentication/authorization
  app.get('/', (req, res) => {
    if (req.user) {
      res.send(
        'Yes, you are logged in. Your github username is ______. f you are here, you definitely know where the API documentation is!'
      );
    } else {
      res.send(
        'Welcome to the Centrifuge Faucet API. If you are here, you definitely know where the API documentation is!'
      );
    }
  });
}

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err));
  next();
});

export default app;
