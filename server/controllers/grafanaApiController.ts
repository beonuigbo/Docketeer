// import { Request, Response, NextFunction } from 'express';
import { grafanaController, ServerError } from '../../types';
const fetch = require('node-fetch');

interface GrafanaResponse {
  key: string;
}

const grafanaApiController: grafanaController = {};

grafanaApiController.getApi = async (req, res, next) => {
  console.log('HEYYYYYYYY');
  try {
    const response = await fetch('http://localhost:3000/api/auth/keys', {
      method: 'POST',
      // mode: 'no-cors',
      headers: {
        Authorization:
          'Basic ' + Buffer.from('admin:prom-operator').toString('base64'),
        Accept: '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: Math.random().toString(36).substring(7),
        role: 'Admin',
        secondsToLive: 86400,
      }),
    });
    console.log('YO BOI');
    const data = (await response.json()) as GrafanaResponse;
    res.locals.key = data.key;

    return next();
  } catch (error) {
    console.log('Error:', error);
    return next({
      log: 'failed',
      status: 500,
      message: {
        err: '',
      },
    });
  }
};

grafanaApiController.getUid = async (req, res, next) => {
  console.log('HELLO HIT CONTROLLER HERE');
  const { key, dashboard }: { key: string; dashboard: string } = req.body;
  try {
    const response = await fetch(
      `http://localhost:3000/api/search?query=${encodeURIComponent(dashboard)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data: any = await response.json();
    const uidKey: any = data[0].uid;
    res.locals.uid = uidKey;
    console.log('UID KEY HERE!!', uidKey);
    return next();
  } catch (err) {
    return next({
      log: 'getUid failed',
      status: 200,
      message: { err: 'Cant get uid' },
    });
  }
};

export default grafanaApiController;
