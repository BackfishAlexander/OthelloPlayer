#!/usr/bin/env node
const net = require('net');
const util = require('./util');

const defaultPort = 1337;
const defaultHost = 'localhost';
const defaultDepth = 9;
const args = process.argv.slice(3);

const client = new net.Socket();
client.connect(args[1] || defaultPort, args[2] || defaultHost, () => {
  console.log('Connected');
});

client.on('close', () => {
  console.log('Connection closed.');
  });


client.on('error', (error) => {
  console.log(`Error: ${error.toString()}`);
});

client.on('data', (data) => {
  console.log(`Received ${data}`);
  const jsonData = JSON.parse(data);
  const move = util.getMove(jsonData.player, jsonData.board, args[0] || defaultDepth);
  const response = util.prepareResponse(move);
  client.write(response);
});


