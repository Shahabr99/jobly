const express = require('express')
const router = express.Router();
const Job = require('../models/job');
const jsonschema = require('jsonschema')
const jobNewSchema = require('../schemas/jobNew.json');
const jobUpdate = require('../schemas/jobUpdate.json');
const jobSearch = require('../schemas/jobSearch.json')
const { BadRequestError, NotFoundError } = require('../expressError');
const {ensureAdmin} = require('../middleware/auth')


router.post('/',ensureAdmin, async function(req, res, next) {
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
  
  const q = req.query;
  if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
  q.hasEquity = q.hasEquity === "true";

   
  try{
    const validator = jsonschema.validate(q, jobSearch);
    if(!validator.valid) {
      const errs = validator.errors.map(err => err.stack)
      throw new BadRequestError(errs)
    }
    const jobs = await Job.findAll();
    return res.json({jobs})
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


router.patch("/:id", ensureAdmin, async function(req, res, next) {
  try{
    const {id} = req.params;
    const validator = jsonschema.validate(req.body, jobUpdate)
    if(!validator.valid) {
      const errList = validator.errors.map(err => err.stack);
      throw new BadRequestError(errList)
    }
    const job = await Job.update(id, req.body);
    return res.json({job});
  }catch(e){
    return next(e)
  }
})


router.delete('/:id',ensureAdmin, async function(req, res, next) {
  try {
    const {id} = req.params;
    await Job.remove(id);
    return res.json({deleted: +id})
  }catch(e){
    return next(e)
  }
})


module.exports = router