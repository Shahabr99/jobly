const express = require('express')
const router = express.Router();
const Job = require('../models/jobs');
const jsonschema = require('jsonschema')
const jobNewSchema = require('../schemas/jobNew.json');
const { BadRequestError, NotFoundError } = require('../expressError');


router.post('/', async function(req, res, next) {
  try{
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if(!validator.valid) {
      const errList = validator.errors.map(err => err.stack);
      throw new BadRequestError(errList)
    }
    const job = await Job.create(req.body);
    return res.status(201).json({ job })
  }catch(e) {
    return next(e)
  }
})


router.get('/', async function(req, res, next) {
  try{
    const jobs = await Job.getAll();
    
    return res.json(jobs)
  }catch(e) {
    return next(e)
  }
})

router.get("/:id", async function(req, res, next) {
  try {
    const {id} = req.params;
    const job = await Job.get(id);
    return res.json({job})
  }catch(e){
    return next(e)
  }
})


router.patch("/:id", async function(req, res, next) {
  try{
    const {id} = req.params;
    const updatedJob = await Job.update(id, req.body);
    return res.status(202).json({updatedJob});
  }catch(e){
    return next(e)
  }
})


router.delete('/:id', async function(req, res, next) {
  try {
    const {id} = req.params;
    const result = await Job.remove(id);
    return res.json(result)
  }catch(e){
    return next(e)
  }
})


module.exports = router