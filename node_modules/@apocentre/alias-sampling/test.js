var test   = require('tape'),
    sample = require('./');

test('Always 3', function (t) {
  var s = sample([0.0, 0.0, 0.0, 1.0]);

  t.plan(10);
  
  for (i = 0; i < 10; i++) {
    t.equal(s.next(), 3);
  }
});

test('Always 137', function (t) {
  var s = sample([0.0, 0.0, 1.0], [10, 11, 137]);
  
  t.plan(10);

  for (i = 0; i < 10; i++) {
    t.equal(s.next(), 137);
  }
});

test('First outcome 0.5', function (t) {
  var s = sample([0.5, 0.25, 0.25], [10, 11, 12]),
      c1 = 0,
      c2 = 0;
  
  t.plan(2);

  for (i = 0; i < 1000; i++) {
    if(s.next() == 10) 
      c1++;
    else 
      c2++;
  }

  t.equals(c1 + c2, 1000);
  t.ok(c1 > 440 && c1 < 550, 'Half approx.');
});

test('Multiple outcomes', function (t) {
  var s = sample([0.5, 0.25, 0.25], [10, 11, 12]),
      outcomes = [],
      c1 = 0;
  
  t.plan(2);

  outcomes = s.next(1000);

  for (i = 0; i < outcomes.length; i++) {
    if(outcomes[i] == 10) c1++;
  }

  t.equals(outcomes.length, 1000);
  t.ok(c1 > 440 && c1 < 550, 'Half approx.');
});

test('String outcome', function (t) {
  var s = sample([0.85, 0.15], ['A', 'B']),
      ok = false;
  
  t.plan(1);

  for (i = 0; i < 1000; i++) {
    if(s.next() == 'A') { 
      ok = true; 
      break;
    }
  }
  t.ok(ok, 'A is found');
});

test('Probability cannot be zero', function (t) {
  var e;

  t.plan(1);

  try {
    sample([0.0, 0.0, 0.0]);
  } catch (ex) {
    e = ex;
  }

  t.ok(e, e);
});

test('Probability must be positive', function (t) {
  var e;

  t.plan(1);

  try {
    sample([0.0, -10.0, 0.0]);
  } catch (ex) {
    e = ex;
  }

  t.ok(e, e);
});
