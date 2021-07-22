const chaiHttp = require('chai-http')
const chai = require('chai')
const assert = chai.assert
const server = 'https://IssueTracker.saurabhv749.repl.co'

chai.use(chaiHttp)

suite('Functional Tests', function () {
  // # 1   create
  test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .type('form')
      .send({
        created_by: 'frustated men',
        issue_title: 'some title',
        issue_text: 'something about the issue that has to be solved',
        assigned_to: 'owner',
        status_text: 'lets do the worlk',
      })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.typeOf(data.body, 'object')
        done()
      })
  })
  // # 2
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .type('form')
      .send({
        created_by: 'frustated men',
        issue_title: 'some title',
        issue_text: 'something about the issue.',
      })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.typeOf(data.body, 'object')
        done()
      })
  })
  // # 3
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .type('form')
      .send({ issue_text: 'something about the issue.' })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.equal(data.body.error, 'required field(s) missing')
        done()
      })
  })
  // # 4     read
  test('View issues on a project: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.typeOf(data.body, 'array')
        done()
      })
  })
  // # 5
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .query({ open: true })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.typeOf(data.body, 'array')
        done()
      })
  })
  // # 6
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .query({ open: true, created_by: 'another' })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.typeOf(data.body, 'array')
        done()
      })
  })
  //  #7     update
  test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .type('form')
      .send({ created_by: 'lamborginni', _id: '60f8f6346ffff6019539d6a5' })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.equal(data.body.result, 'successfully updated')
        assert.equal(data.body._id, '60f8f6346ffff6019539d6a5')
        done()
      })
  })
  //  #8
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .type('form')
      .send({
        created_by: 'mustag',
        _id: '60f8f6346ffff6019539d6a5',
        assigned_to: 'Jalegi_Bai',
      })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.equal(data.body.result, 'successfully updated')
        assert.equal(data.body._id, '60f8f6346ffff6019539d6a5')
        done()
      })
  })

  // //  #9
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .type('form')
      .send({ created_by: 'frustated guy', assigned_to: 'Jalegi_Bai' })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.equal(data.body.error, 'missing _id')
        done()
      })
  })

  // //  #10
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .type('form')
      .send({ _id: '60f7e027b667f02a0cde43ea' })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.equal(data.body.error, 'no update field(s) sent')
        assert.equal(data.body._id, '60f7e027b667f02a0cde43ea')
        done()
      })
  })
  // //  #11
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .type('form')
      .send({
        created_by: 'frustated guy',
        _id: '60f844a2345f8c050078e8bd',
        assigned_to: 'Jalegi_Bai',
      })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.equal(data.body.error, 'could not update')
        assert.equal(data.body._id, '60f844a2345f8c050078e8bd')
        done()
      })
  })

  // //  # delete 12
  test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .type('form')
      .send({ _id: '60ac0500f84478e8bd516ef8' })
      .end(function (err, data) {
        assert.isNull(err)
        assert.equal(data.status, 200)
        assert.equal(data.body.error, 'could not delete')
        assert.equal(data.body._id, '60ac0500f84478e8bd516ef8')
        done()
      })
  })

  // //  # delete 13
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .type('form')
      .send({ _id: '60f844ac050078e8bd516ef8' })
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.equal(data.body.error, 'could not delete')
        assert.equal(data.body._id, '60f844ac050078e8bd516ef8')
        done()
      })
  })

  // //  # delete 14
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .type('form')
      .send({})
      .end(function (err, data) {
        assert.equal(data.status, 200)
        assert.equal(data.body.error, 'missing _id')
        done()
      })
  })
})
