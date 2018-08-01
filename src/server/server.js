import https from 'https';
import http from 'http';
import express from "express";
import bodyParser from "body-parser";
import fs from "fs"
import databox from 'node-databox';

const DATABOX_ZMQ_ENDPOINT = process.env.DATABOX_ZMQ_ENDPOINT
const credentials = databox.getHttpsCredentials();

const PORT = process.env.port || '8080';

const tsc = databox.NewTimeSeriesBlobClient(DATABOX_ZMQ_ENDPOINT, false);

let metaData = databox.NewDataSourceMetadata();

const personalLoggerActuator = {
    ...metaData,
    Description: 'personal data logger',
    ContentType: 'application/json',
    Vendor: 'Databox Inc.',
    DataSourceType: 'personalLoggerActuator',
    DataSourceID: 'personalLoggerActuator',
    StoreType: 'ts',
    IsActuator: true,
}

const personalFlow = {
    ...metaData,
    Description: 'App personal data flows',
    ContentType: 'application/json',
    Vendor: 'Databox Inc.',
    DataSourceType: 'personalFlow',
    DataSourceID: 'personalFlow',
    StoreType: 'ts',
}

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

///then we create a store to write actuation data into!

let datasourceid = "personalLoggerActuator";
console.log("actuator started!!");
tsc.RegisterDatasource(personalFlow).then(() => {
    console.log("registered personal Flow store");
    return tsc.RegisterDatasource(personalLoggerActuator)
}).catch((err) => { console.log("error registering personal flow store!", err) }).then(() => {
    console.log("registered personal logger actuator!");
    tsc.Observe(personalLoggerActuator.DataSourceID, 0)
        .catch((err) => {
            console.log("[Actuation observing error]", err);
        })
        .then((eventEmitter) => {
            eventEmitter.on('data', (data) => {
                console.log("[Actuation] data received ", data);
                tsc.Write("personalFlow", data).then((body) => {
                    console.log("successfully written to personalFlow!");
                }).catch((error) => {
                    console.log("failed to write personalFlow", error);
                });
            });
        })
        .catch((err) => {
            console.log("[Actuation error]", err);
        });
});

app.get("/status", function (req, res) {
    res.send("active");
});

console.log("[Creating https server]", PORT);
https.createServer(credentials, app).listen(PORT);