const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const Post = require('./models/Post');
const { sequelize } = require('./models/db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');




// Configuração do Passport.js
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'senha'
}, async function(email, senha, done) {
  try {
    const usuario = await Post.findOne({ where: { email } });

    if (usuario) {
      // Email já cadastrado, retorna um erro
      return done(null, false, { message: 'Email já cadastrado.' });
    }

    // Email não cadastrado, retorna sucesso
    return done(null, true);
  } catch (error) {
    return done(error);
  }
}));




//Serialização e Deserialização 
  // Serialização do usuário
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialização do usuário
  passport.deserializeUser(function(id, done) {
    Post.findByPk(id)
      .then(function(user) {
        done(null, user);
      })
      .catch(function(error) {
        done(error);
      });
  });




// Configuração do middleware express-session
app.use(session({
  secret: 'chave-secreta',
  resave: false,
  saveUninitialized: false
}));




// Inicialização do Passport.js
app.use(passport.initialize());
app.use(passport.session());




//body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())




//rote de inicio 
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/startview.html");
});




// Rota de cadastro
app.post('/add', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.send("Houve um erro: " + err);
    }
    if (!user) {
      return res.send("Email já cadastrado. <a href='/cadastro'>Voltar ao cadastro</a>");
    }
    Post.create({
      nome: req.body.nome,
      email: req.body.email,
      senha: req.body.senha
    }).then(function() {
      res.sendFile(__dirname + "/views/login.html");
    }).catch(function(erro) {
      res.send("Houve um erro: " + erro);
    });
  })(req, res, next);
});




// Rota de login
app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/views/login.html");
});




// Rota de cadastro
app.get("/cadastro", function(req, res) {
  res.sendFile(__dirname + "/views/cadastro.html");
});




// Rota para a página top10
app.post('/logar', function(req, res) {
  const { email, senha } = req.body;

  Post.findOne({
    where: {
      email: email,
      senha: senha
    }
  }).then(function(result) {
    if (result) {
      res.sendFile(__dirname + "/views/top10.html");
    } else {
      res.send("E-mail não cadastrado. <a href='/login'>Ir para login</a>");
    }
  }).catch(function(erro) {
    res.send("Houve um erro: " + erro);
  });
});




app.listen(4700, function() {
  console.log("Servidor Top 10 brejas rodando na url http://localhost:4700");
});
