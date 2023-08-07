const request = require('supertest');
const app = require('../app');
const { badRequestError } =  require('../expressError');
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


describe("POST /jobs", function() {
  test("should add a new job to database", async function() {
    const jobData = {"title":"SW", "salary": 3000, "equity":"1.0", "company_handle":"c1"}
    const res = await request(app).post('/jobs').send(jobData)
    expect(res).toEqual(expect.any(Object))
  })
});

describe("GET /jobs", function(){
  test("should get all jobs", async function() {
    const response = await request(app).get("/jobs");
    
    const jobs = response.body;
    expect(jobs).toEqual(expect.any(Array))
  });
});


describe("GET /jobs/id", function() {
  test("Should return a job based on id", async function() {
    const newJob = await Job.create({
      title: 'Software Engineer',
      salary: 10000,
      equity: 0.1,
      company_handle: 'c1'
    })

    
    const res = await request(app).get(`/jobs/${newJob.id}`);

    console.log(res.body);

    expect(res.status).toEqual(200)
    expect(res.body.job).toEqual({
      title: 'Software Engineer',
      salary: 10000,
      equity: 0.1
    })
  })
})