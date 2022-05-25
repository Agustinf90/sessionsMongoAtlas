var express = require('express');
var router = express.Router();
const auth = require('../middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render("login");
});

router.get('/logout', function(req, res, next) {
  let {user} = req.body
  req.session.destroy(error=>{
    if(!error) res.send("Usted se ha deslogeado correctamente")
    else res.send({status:"logout error", body: error})
  })
});


router.post('/login', function(req, res, next) {
  let {user, password} = req.body
 req.session.user = user;
 if(req.session.contador){
  req.session.contador++
  res.send(`<p> Bienvenido ${user} esta es tu visita nro. ${req.session.contador}</p>`)
 }
 else{
   req.session.contador = 1
   res.send(`<p> Bienvenido ${user} esta es tu visita nro. ${req.session.contador}</p>`)
 }

});

router.get('/contenido', auth ,function(req, res, next) {
  res.send("Usted está logueado y puede ver el contenido");
});

module.exports = router;
