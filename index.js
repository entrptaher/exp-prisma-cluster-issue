const cluster = require('cluster');
const os = require('os');
const delay = require('delay');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const argv = require('minimist')(process.argv.slice(2));
const port = process.env.PORT || argv.port || 3000;
const forks = process.env.FORKS || argv.forks || os.cpus().length;

async function run() {
  const app = express();
  const prisma = new PrismaClient();

  app.get('/create', async (req, res) => {
    const length = Number(req.query.length || 1);
    const rawData = 'x'.repeat(length);
    const post = await prisma.post.create({
      data: { data: rawData, json: { rawData } },
    });
    const total = await prisma.post.count();
    res.send({ pid: process.pid, post, total });
  });

  app.get('/load', async (req, res) => {
    const data = await newData();
    res.send({ data });
  });

  app.get('/read', async (req, res) => {
    const id = Number(req.query.id);
    if (id) {
      const result = await prisma.post.findOne({ where: { id } });
      res.send({ pid: process.pid, result });
    } else {
      await delay(1000);
      console.log(process.pid);
      const all = await prisma.post.count();
      res.send({ pid: process.pid, all });
    }
  });

  app.listen(port, () => {
    console.log(`PID: ${process.pid}, Listening at ${port}`);
  });
}

if (cluster.isMaster) {
  for (let i = 0; i < forks; i++) {
    cluster.fork();
  }
} else {
  run();
}
