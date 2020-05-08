import express from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import flash from 'express-flash';
import PrettyError from 'pretty-error';
import expressOasGenerator from 'express-oas-generator';
import session from 'express-session';
import corsOptions from './cors';
import tokenRequest from './routes/tokenRequest';
import healthcheck from './routes/healthCheck';

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
app.use(flash());

app.use('/token-request', tokenRequest);
app.use('/healthcheck', healthcheck);

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err));
  next();
});

export default app;
