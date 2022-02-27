const PythonShell = require('python-shell').PythonShell;

PythonShell.run('test/app.py', null, function (err, data) {
  if (err) throw err;
  console.log('finished');
  console.log(data)
});