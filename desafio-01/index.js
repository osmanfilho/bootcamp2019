const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
var qtdRequisicoes = 0;

function logRequisicoes(req, res, next){
  qtdRequisicoes++;

  console.log('Quantidade de Requisições: ' + qtdRequisicoes);
  return next();
}

function existeProjeto(req,res, next){
  const { id } = req.params;

  console.log('Metodo: ' + req.method);

  const project = projects.find( p => p.id == id );
  
  if (!project){
    return res.status(400).json({"error":"Projeto não localizado!"});  
  }

  return next();
}

server.use(logRequisicoes);

server.post('/projects/', (req, res) =>{
  projects.push({"id": req.body.id, "title": req.body.title, tasks: []})

  return res.json({"id": req.body.id, "title": req.body.title});
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', existeProjeto, (req, res) => {
  const { id } = req.params;

  const project = projects.find( p => p.id == id );
  project.title = req.body.title;  
  
  return res.json({"message": "Projeto atualizado com sucesso!"});
});

server.delete('/projects/:id', existeProjeto, (req, res) =>{
  const { id } = req.params;

  const projectid = projects.findIndex( p => p.id == id );
  projects.splice(projectid, 1);  
  return res.json({"message": "Projeto removido com sucesso!"});
});

server.post('/projects/:id/tasks', existeProjeto, (req, res) =>{
  const { id } = req.params;

  const project = projects.find( p => p.id == id );
  project.tasks.push(req.body.title);  
  return res.json({"message": "Tarefa atualizada com sucesso!"});
});

server.listen(3000);