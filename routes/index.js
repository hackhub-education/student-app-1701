var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/webdxd');

var studentSchema = {
  firstname: String,
  lastname: String,
  gender: String,
  school: String,
  age: Number,
  isEnrolled: Boolean
};

var Students = mongoose.model('Students', studentSchema, 'students');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WebDxD', author: 'Yan' });
});

/* GET students page. */
router.get('/students', function(req,res,next) {
  Students.find().exec(function(err, doc) {
    res.render('students', {title: 'All Students', students: doc});
  });
});

/* POST add student. */
router.post('/students/add', function(req, res, next) {
  var newStudent = new Students(req.body);
  newStudent.save(function (err, doc) {
    res.render('studentDetail', {student: doc});
  });
});

/* GET add student form */
router.get('/students/add', function(req, res, next) {
  res.render('newStudent', {student: {}, action: '/students/add', title: 'Add New Student'});
});

/* GET student object and insert it into update form */
router.get('/students/update/:id', function(req, res, next) {
  Students.findById(req.params.id).exec(function(err, doc) {
    res.render('newStudent', {student: doc, action: '/students/update/' + doc._id, title: 'Update Student Info'});
  });
});

/* POST student object to current object in database */
router.post('/students/update/:id', function(req,res, next) {
  Students.update({_id: req.params.id}, {$set: req.body}).exec(function(err, doc) {
    if (err) {
      // handle err
    } else {
      res.redirect('/students/' + req.params.id);
    }
  });
});


/* GET remove student by id. */
router.get('/students/remove/:id', function(req, res, next) {
  Students.remove({_id: req.params.id}, function(err, doc) {
    if (err) {
      // handle err
    } else {
      res.redirect('/students');
    }
  })
});

/* GET student detail by id. */
router.get('/students/:id', function(req,res,next) {
  Students.findById(req.params.id).exec(function(err, doc) {
    res.render('studentDetail', {student: doc});
  });
});

/* POST find students by name. */
router.post('/students/search', function(req, res, next) {
  Students.find({'firstname': req.body.firstname}).exec(function(err, doc) {
    if (err) {
      // handle error
    } else {
      if (doc.length === 0) {
        res.render('students', {title: 'No Results Found.', students: doc});
      }
        res.render('students', {title: 'Search Results', students: doc});
    }
  });
});

module.exports = router;
