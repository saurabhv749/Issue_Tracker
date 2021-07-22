'use strict'

const ObjectID = require('mongodb').ObjectID
module.exports = function (app,Issue) {
  const createSearch = (body,project) => {
    let search = {}
    const keysAvlbl = [
      'open',
      'created_by',
      'created_on',
      'updated_on',
      'issue_title',
      'issue_text',
      '_id',
      'assigned_to',
      'status_text',
    ]

    Object.keys(body).map((d) => {
      for (let el of keysAvlbl) if (el === d) search[el] = body[el]
    })
    search.project = project
    // console.log(search)
    return search
  }

  app
    .route('/api/issues/:project')

    .get(function (req, res) {
          const project = req.params.project
            if(req.query){
              const search = createSearch(req.query,project)
               Issue.find(search, { __v: 0 ,project:0}, function (err, docs) {
                       if (err)
                        res.end()
                      else 
                        res.json(docs)
                });
            }
          else {
            Issue.find({project}, { __v: 0,project:0 }, function (err, docs) {
            if (err) 
            res.end()
             res.json(docs)
          })}
    })

    .post(function (req, res) {
      let project = req.params.project;
      const { issue_title, issue_text, created_by } = req.body

      const details = { issue_title, issue_text, created_by }
      if (issue_title && issue_text && created_by) {
        if (req.body.assigned_to !== '')
          details.assigned_to = req.body.assigned_to
        if (req.body.status_text !== '')
          details.status_text = req.body.status_text

        details.project = project
        new Issue(details).save((err, doc) => {
          if (!err) {
            const {
              created_on,
              updated_on,
              assigned_to,
              status_text,
              open,
              _id,
              issue_title,
              issue_text,
              created_by,
            } = doc
            res.json({
              _id,
              created_by,
              issue_title,
              issue_text,
              open,
              assigned_to,
              status_text,
              created_on,
              updated_on,
            })
          } else res.json({ error: 'failed to register' })
        })
      } else res.json({ error: 'required field(s) missing' })
    })

    .put(async function (req, res) {
      let project = req.params.project;
      if (req.body._id) {
        let user
        try {
          user = await Issue.findOne({ _id: ObjectID(req.body._id),project })
          
          Object.keys(req.body).map((d) => {
            if (d !== '_id' && req.body[d]) user[d] = req.body[d]
          })

          if (user && Object.keys(req.body).length > 1) {
            user.updated_on = Date.now()
            Issue.updateOne(
              { _id: req.body._id,project},
              user,
              { new: true },
              (err) => {
                if (err)
                  res.json({ error: 'could not update', _id: req.body._id })
                else
                  res.json({
                    result: 'successfully updated',
                    _id: req.body._id,
                  })
              }
            )
          } else
            res.json({ error: 'no update field(s) sent', _id: req.body._id })
        } catch (error) {
          res.json({ error: 'could not update', _id: req.body._id })
        }

        //
      } else res.json({ error: 'missing _id' })
    })

    .delete( function (req, res) {
      let project = req.params.project;
      if (req.body._id) {
        Issue.deleteOne({ _id: ObjectID(req.body._id) ,project})
          .then((data) => {
            if (data.n == 1)
              res.json({ result: 'successfully deleted', _id: req.body._id })
            else res.json({ error: 'could not delete', _id: req.body._id })
          })
          .catch(() =>
            res.json({ error: 'could not delete', _id: req.body._id })
          )
      } else res.json({ error: 'missing _id' })
    })
}
