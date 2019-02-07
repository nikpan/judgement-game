var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/users', function(req, res, next) {
  res.json([
    {id:1, username:'somebody'}
  ]);
});

module.exports = router;
