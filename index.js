const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const server = express();

server.use(express.json());
server.use(helmet());

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  }
};

const db = knex(knexConfig);

server.post("/api/zoos", (req, res) => {
  db("zoos")
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db("zoos")
        .where({ id })
        .first()
        .then(role => {
          res.status(201).json(role);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/zoos/:id", (req, res) => {
  const zooId = req.params.id;
  db("zoos")
    .where({ id: zooId })
    .first()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.delete("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "Record not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.put("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "Record not found" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

const port = 3300;
server.listen(port, () =>
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`)
);
