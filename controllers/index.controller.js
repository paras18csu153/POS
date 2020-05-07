const http = require('http');

exports.homePage = function (req, res) {
  console.log('Cookies: ', req.cookies);
  var promises = [];
  var data = {};
  if (req.cookies.authorization) {
    var userPromise = new Promise((resolve, reject) => {
      // Create options
      const options = {
        hostname: req.hostname,
        port: 3000,
        path: '/user/',
        method: 'GET',
        headers: {
          "authorization": req.cookies.authorization
        },
      };

      // Make http request
      const httpReq = http.request(options, httpRes => {
        var buff = '';
        httpRes.on('data', chunks => {
          buff += chunks;
        });

        httpRes.on('end', () => {
          if (httpRes.statusCode === 200) {
            data.user = JSON.parse(buff);
            resolve();
          } else {
            reject(JSON.parse(buff));
          }
        });
      });

      httpReq.on('error', error => {
        reject(error);
      });

      httpReq.end();
    });
    promises.push(userPromise);


    var ownerPromise = new Promise((resolve, reject) => {
      // Create options
      const options = {
        hostname: req.hostname,
        port: 3000,
        path: '/verificationpage',
        method: 'GET',
        headers: {
          authorization: req.cookies.authorization
        },
      };

      // Make http request
      const httpReq = http.request(options, httpRes => {
        var buff = '';
        httpRes.on('data', chunks => {
          buff += chunks;
        });

        httpRes.on('end', () => {
          if (httpRes.statusCode === 200) {
            data.dashtype = JSON.parse(buff);
            resolve();
          } else {
            reject(JSON.parse(buff));
          }
        });
      });

      httpReq.on('error', error => {
        reject(error);
      });

      httpReq.end();
    });
    promises(ownerPromise)
  }

  Promise.all(promises)
    .then(() => {
      console.log(data);
      res.render('index', data);
    })
    .catch(error => {
      console.log(error);
      res.render('error', error);
    });
};
exports.Ownerdashboard = function (req, res) {
  if (req.cookies.authorization) {
    res.render('Ownerdashboard');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.signupPage = function (req, res) {
  res.render('signup');
}
exports.verificationPage = function (req, res) {
  if (req.cookies.authorization) {
    res.render('verificationpage');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.ownerviewtables = function (req, res) {
  if (req.cookies.authorization) {
    res.render('ownerviewtables');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.addtable = function (req, res) {
  if (req.cookies.authorization) {
    res.render('addtable');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.updatetable = function (req, res) {
  if (req.cookies.authorization) {
    res.render('updatetable');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.deletetable = function (req, res) {
  if (req.cookies.authorization) {
    res.render('deletetable');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.employees = function (req, res) {
  if (req.cookies.authorization) {
    res.render('Employees');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.addemployee = function (req, res) {
  if (req.cookies.authorization) {
    res.render('addemployee');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.verificationPageemployee = function (req, res) {
  if (req.cookies.authorization) {
    res.render('verificationPageemployee');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.addemployeedetails = function (req, res) {
  if (req.cookies.authorization) {
    res.render('addemployeedetails');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.updateemployee = function (req, res) {
  if (req.cookies.authorization) {
    res.render('updateemployee');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.deleteemployee = function (req, res) {
  if (req.cookies.authorization) {
    res.render('deleteemployee');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.viewdishes = function (req, res) {
  if (req.cookies.authorization) {
    res.render("viewdishes");
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.adddish = function (req, res) {
  if (req.cookies.authorization) {
    res.render('adddish');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.updatedish = function (req, res) {
  if (req.cookies.authorization) {
    res.render('updatedish');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}
exports.deletedish = function (req, res) {
  if (req.cookies.authorization) {
    res.render('deletedish');
  } else {
    res.status(401).send({
      message: "Unauthorized access"
    });
  }
}