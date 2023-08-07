const db = require('../db');
const { BadRequestError } = require('../expressError');
const Job = require('../models/jobs')
const {
  commonBeforeAll,
  commonAfterAll,
  commonBeforeEach,
  commonAfterEach
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe("create", function() {
  const newJob = {handle:'c1', title:'SW', salary:5000, equity: "1.0"};
  test("should create a new job", async function() {
    
    const job = await Job.create(newJob);
  
    expect(job).toMatchObject({title: 'SW', salary: 5000, equity: "1.0"});
  })

  test("returns error if there is a duplicate", async function() {
   try{
    await Job.create(newJob);
    await Job.create(newJob);
   }catch(err){
    expect(err instanceof BadRequestError).toBeTruthy()
   }
  })
});

describe("Get all jobs", function() {
  test("should return all the listed jobs", async function() {
     const jobs = await Job.getAll();
     expect(jobs).toEqual(expect.any(Array))
  })
})